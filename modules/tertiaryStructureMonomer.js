import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';
import biochemStyling from './biochemStyling';


export default function tertiaryStructureMonomer() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const residueIndexes = [38,205,187,140,68,111,49,53,,213,216];

const hBondAtomPairs = [[1008,1642],[706,781],[2809,2067],[3214,3240],[547,3103],[547,3101]];


tertiaryStructureMonomer.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    var hydrophobicityColorFun = null;
    if (usingAdmin) {
        var hydrophobicityInputs = addStyleControls(adminDivId);
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);

        hydrophobicityColorFun = function() {
            var r = {};
            for (var t in hydrophobicityInputs) {
                r[t] = hydrophobicityInputs[t].val();
            }
            return r;
        };
    } else {
        hydrophobicityColorFun = function() {
            return defaults.hydrophobicityColors
        };
    }

    var buttonValues = ['ribbon', 'ribbon + surface', 'interacting amino acids (sticks)', 'interacting amino acids (spheres)',
        'hydrophobicity (ribbon)', 'hydrophobicity (sticks)'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc chain A monomer mixed case.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('tertiaryStructureMonomer.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb", {keepH:true});

        var terminalAtoms = swapViewer.getModel().selectedAtoms({serial:[1,3708]});
        var terminalAtomsMap = {};
        terminalAtomsMap["N"] = terminalAtoms[0];
        terminalAtomsMap["C"] = terminalAtoms[1];

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, 'terminalAtomsMap':terminalAtomsMap,
                'hydrophobicityColorFun':hydrophobicityColorFun};
            b.click(eventData, swapView);
        }

        swapView({'data':{'swapViewer':swapViewer, viewName:'ribbon', 'terminalAtomsMap':terminalAtomsMap,
            'hydrophobicityColorFun':hydrophobicityColorFun}});

        swapViewer.setView([-7.067,11.737,-12.030,-22.718,0.688,0.3163,0.0435,-0.6516]);
        swapViewer.render();
    }});
};

const addStyleControls = function(adminDivId) {
    var adminDiv = $('#' + adminDivId);

    adminDiv.append('hydrophobicity colors:<br/>');

    var inputs = {};
    adminDiv.append('hydrophobic:  ');
    for (var hydroType in defaults.hydrophobicityColors) {
        var hydroColor = defaults.hydrophobicityColors[hydroType];
        var hydroInputId = hydroType + 'ColorInput';

        adminDiv.append('<input id="' + hydroInputId + '" type="text" value="' + hydroColor + '"/><br/>');
        inputs[hydroType] = adminDiv.children('#' + hydroInputId);
    }

    return inputs;
};


const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('tertiaryStructureMonomer.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;
    var terminalAtomsMap = event.data.terminalAtomsMap;
    var hydrophobicityColorFun = event.data.hydrophobicityColorFun;

    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();
    swapViewer.removeAllSurfaces();

    if ('ribbon' == viewName) {
        var curCartoonStyle = {color:'spectrum'};
        $.extend(curCartoonStyle, defaults.defaultCartoonStyle);
        swapViewer.setStyle({}, {cartoon:curCartoonStyle});

        var labelMap = $.extend({}, defaults.residueLabelStyle);

        logger.trace('tertiaryStructureMonomer.swapView terminalAtomsMap:  ' +
            JSON.stringify(terminalAtomsMap));

        for (var terminalAtomLabel in terminalAtomsMap) {
            var terminalAtom = terminalAtomsMap[terminalAtomLabel];

            labelMap['position'] = {x:terminalAtom.x, y:terminalAtom.y, z:terminalAtom.z};

            swapViewer.addLabel(terminalAtomLabel, labelMap);
        }

    } else if ('ribbon + surface' == viewName) {
        //this extra dictionary is not necessary however I'm leaving it in case extra styling is requested
        var curCartoonStyle = {color:'spectrum'};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        swapViewer.setStyle({}, {cartoon:curCartoonStyle});

        swapViewer.addSurface('VDW', {opacity:0.8,color:'white'});

    } else if ('interacting amino acids (sticks)' == viewName) {
        //this extra dictionary is not necessary however I'm leaving it in case extra styling is requested
        var curCartoonStyle = {};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        swapViewer.setStyle({}, {cartoon:curCartoonStyle});

        swapViewer.setStyle({resi:residueIndexes}, {stick:defaults.stickStyle, cartoon:curCartoonStyle});
        swapViewer.addResLabels({resi:residueIndexes}, defaults.residueLabelStyle);

        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
    } else if ('interacting amino acids (spheres)' == viewName) {
        //this extra dictionary is not necessary however I'm leaving it in case extra styling is requested
        var curCartoonStyle = {};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        swapViewer.setStyle({}, {cartoon:curCartoonStyle});

        swapViewer.setStyle({resi:residueIndexes}, {sphere:{colorscheme:defaults.elementColors},
            cartoon:curCartoonStyle});

        swapViewer.addResLabels({resi:residueIndexes}, defaults.residueLabelStyle);
    } else if ('hydrophobicity (ribbon)' == viewName) {
        var hydrophobicityColors = hydrophobicityColorFun();
        biochemStyling.applyHydrophobicityColors(swapViewer, 'cartoon', defaults.cartoonStyle,
            hydrophobicityColors);
    } else if ('hydrophobicity (sticks)' == viewName) {
        var hydrophobicityColors = hydrophobicityColorFun();
        biochemStyling.applyHydrophobicityColors(swapViewer, 'stick', {singleBonds:true},
            hydrophobicityColors);
    }
    swapViewer.render();
};
