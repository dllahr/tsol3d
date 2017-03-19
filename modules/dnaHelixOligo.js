import buildUtils from './buildUtils';
import admin from './admin';
import biochemStyling from './biochemStyling';
import defaults from './defaults';


export default function dnaHelixOligo() {};

var logger = log4javascript.getLogger('tsol3dmolLogger');

const baseColors = {
    A: '#45D180',
    C: '#41AAF7',
    G: '#F9BD3A',
    T: '#F95360'
};

const colorByBases = function(swapViewer, baseColors) {
    for (var b in baseColors) {
        var curBaseStyle = $.extend({}, defaults.cartoonStyle);
        curBaseStyle['color'] = baseColors[b];
        swapViewer.setStyle({resn:b}, {'cartoon': curBaseStyle});
    }
}

const _5Prime3PrimeInfo = {
    1: '5\'',
    355: '3\'',
    368: '5\'',
    727: '3\''
};
const _5Prime3PrimeSerialNumbers = [];
for (var atomSerial in _5Prime3PrimeInfo) {
    _5Prime3PrimeSerialNumbers.push(atomSerial);
}

const add5Prime3PrimeLabels = function(swapViewer, serialNumbers) {
    var labelStyle = $.extend({}, defaults.residueLabelStyle);

    if (typeof serialNumbers == 'undefined' || serialNumbers == null) {
        serialNumbers = _5Prime3PrimeSerialNumbers;
    }

    var myModel = swapViewer.getModel();

    var atoms = myModel.selectedAtoms({serial:serialNumbers});

    for (var i = 0; i < atoms.length; i++) {
        var atm = atoms[i];

        var label = _5Prime3PrimeInfo[atm.serial];

        labelStyle['position'] = {x:(atm.x), y:(atm.y), z:(atm.z)};
        swapViewer.addLabel(label, labelStyle);
    }
};

const structureColorsSelection = {
    '#2B8BFF': {atom:['C1\'', 'C2\'', 'C3\'', 'O3\'', 'C4\'', 'O4\'',
        'C5\'', 'O5\'', 'P', 'O1P', 'O2P']}
};
structureColorsSelection['#86BAE5'] = $.extend({invert:true},
    structureColorsSelection['#2B8BFF']);

const colorByStructure = function(swapViewer, baseStyles) {
    for (var styleName in baseStyles) {
        var baseStyle = baseStyles[styleName];
        var curStyle = $.extend({}, baseStyle);

        for (var color in structureColorsSelection) {
            var selection = structureColorsSelection[color];

            curStyle['color'] = color;

            var fullStyle = {};
            fullStyle[styleName] = curStyle;

            swapViewer.setStyle(selection, fullStyle);
        }
    }
}

const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('dnaAlphaHelixOligo.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;

    const hBondAtomPairs = event.data.hBondAtomPairs;

    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();

    if ('ribbon' == viewName) {
        colorByStructure(swapViewer, {cartoon:defaults.cartoonStyle});
        add5Prime3PrimeLabels(swapViewer);
    } else if ('spheres' == viewName) {
        swapViewer.setStyle({}, {sphere:{colorscheme:defaults.elementColors}});
        add5Prime3PrimeLabels(swapViewer);
    } else if ('sticks + H-bonding' == viewName) {
        swapViewer.setStyle({}, {stick:defaults.stickStyle});
        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
        add5Prime3PrimeLabels(swapViewer);
    } else if ('color by element one nucleotide' == viewName) {
        swapViewer.setStyle({resi:9, invert:true}, {stick:defaults.hiddenStyle});
        swapViewer.setStyle({resi:9}, {stick:defaults.stickStyle});
    } else if ('color by element one strand' == viewName) {
        swapViewer.setStyle({chain:'A', invert:true}, {stick:defaults.hiddenStyle});
        swapViewer.setStyle({chain:'A'}, {stick:defaults.stickStyle});
        add5Prime3PrimeLabels(swapViewer, [1, 355]);
    }

    swapViewer.render();
};


dnaHelixOligo.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['ribbon', 'spheres', 'sticks + H-bonding',
        'color by element one nucleotide', 'color by element one strand'];

    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/DNAv2.pdb';
    }

    for (var i = 0; i < buttons.length; i++) {
        var bv = buttonValues[i];
        var b = buttons[i];

        var eventData = {'swapViewer':swapViewer, viewName:bv, 'hBondAtomPairs':hBondAtomPairs};
        b.click(eventData, swapView);
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('dnaAlphaHelixOligo.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, 'pdb');

        swapView({'data':{'swapViewer':swapViewer, viewName:'ribbon', 'hBondAtomPairs':hBondAtomPairs}});

        swapViewer.setView([-5.4222,-4.8156,29.8175,-43.174,-0.3531,-0.5031,-0.6647,0.4248]);
    }});
};

const hBondAtomPairs = [
    [17, 736],
    [18, 734],
    [20, 733],
    [39, 714],
    [37, 715],
    [36, 717],
    [58, 693],
    [56, 694],
    [79, 671],
    [78, 673],
    [100, 651],
    [99, 653],
    [117, 634],
    [118, 632],
    [120, 631],
    [142, 609],
    [140, 610],
    [139, 612],
    [161, 591],
    [159, 592],
    [182, 569],
    [181, 571],
    [199, 552],
    [200, 550],
    [202, 549],
    [221, 529],
    [222, 527],
    [242, 508],
    [240, 509],
    [262, 487],
    [260, 488],
    [283, 465],
    [282, 467],
    [303, 448],
    [304, 446],
    [306, 445],
    [322, 429],
    [323, 427],
    [325, 426],
    [341, 407],
    [342, 405],
    [344, 404],
    [361, 384],
    [363, 383]
];
