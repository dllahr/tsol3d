import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';
import biochemStyling from './biochemStyling';


export default function timTertiaryStructureDimer() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const residueIndexes = {A:[98, 70, 18, 75], B:[77, 17, 49, 11]};

const hBondAtomPairs = [[1449,4872], [1043,3975], [270,4447], [270,4446], [1108,3879]];

const chainColorMap = {A:'0x33a4e6', B:'0x89cdf3'};


timTertiaryStructureDimer.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    var chainColorMapFun = null;
    if (usingAdmin) {
        chainColorMapFun = addStyleControls(adminDivId);

        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    } else {
        chainColorMapFun = function() {return chainColorMap;}
    }

    var buttonValues = ['ribbon', 'ribbon + surface', 'interacting amino acids (sticks)', 'interacting amino acids (spheres)'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_mixed_case.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('$timTertiaryStructureDimer.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb", {keepH:true});

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, 'chainColorMapFun':chainColorMapFun};
            b.click(eventData, swapView);
        }

        swapViewer.setBackgroundColor(0xffffff);
        swapView({'data':{'swapViewer':swapViewer, viewName:'ribbon', 'chainColorMapFun':chainColorMapFun}});
        swapViewer.setView([-15.957,1.653,-23.089,-83.885,-0.6206,-0.01984,-0.5243,0.5827]);
        swapViewer.render();
    }});

};

const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('timTertiaryStructureDimer.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;
    var chainColorMap = event.data.chainColorMapFun();

    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();
    swapViewer.removeAllSurfaces();

    var curCartoonStyle = {};
    $.extend(curCartoonStyle, defaults.cartoonStyle);
    for (var chn in chainColorMap) {
        curCartoonStyle['color'] = chainColorMap[chn];

        swapViewer.setStyle({chain:chn}, {cartoon:curCartoonStyle});
    }

    //no entry for style "ribbon" since it is default - its style is applied to all
    if ('ribbon + surface' == viewName) {
        for (var chn in chainColorMap) {
                swapViewer.addSurface('VDW', {opacity:0.8, color:chainColorMap[chn]}, {chain:chn});
        }
    } else if ('interacting amino acids (sticks)' == viewName) {
        for (var chn in chainColorMap) {
            curCartoonStyle['color'] = chainColorMap[chn];

            swapViewer.setStyle({chain:chn, resi:residueIndexes[chn]},
                {stick:defaults.stickStyle, cartoon:curCartoonStyle});

            swapViewer.addResLabels({chain:chn, resi:residueIndexes[chn]}, defaults.residueLabelStyle);
        }

        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
    } else if ('interacting amino acids (spheres)' == viewName) {
        for (var chn in chainColorMap) {
            curCartoonStyle['color'] = chainColorMap[chn];

            swapViewer.setStyle({chain:chn, resi:residueIndexes[chn]},
                {sphere:{colorscheme:defaults.elementColors}, cartoon:curCartoonStyle});

            swapViewer.addResLabels({chain:chn, resi:residueIndexes[chn]}, defaults.residueLabelStyle);
        }
    }

    swapViewer.render();
};

const addStyleControls = function(adminDivId) {
    var adminDiv = $('#' + adminDivId);
    adminDiv.append('chain colors:  ');
    var inputMap = {};
    for (var chn in chainColorMap) {
        var clr = chainColorMap[chn];
        var inputId = 'chain' + chn + 'ColorInput';

        adminDiv.append(chn + ':' + '<input type="text" id="' + inputId + '" value="' + clr + '"/>');
        inputMap[chn] = adminDiv.children('#' + inputId);
    }
    adminDiv.append('<br/>');

    return function() {
        var colorMap = {};
        for (var chn in inputMap) {
            colorMap[chn] = inputMap[chn].val();
        }
        return colorMap;
    };
};
