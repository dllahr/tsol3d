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

const add5Prime3PrimeLabels = function(swapViewer) {
    var labelStyle = $.extend({}, defaults.residueLabelStyle);

    var myModel = swapViewer.getModel();

    var atoms = myModel.selectedAtoms({serial:_5Prime3PrimeSerialNumbers});

    for (var i = 0; i < atoms.length; i++) {
        var atm = atoms[i];

        var label = _5Prime3PrimeInfo[atm.serial];

        labelStyle['position'] = {x:(atm.x), y:(atm.y), z:(atm.z)};
        swapViewer.addLabel(label, labelStyle);
    }
};

const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('dnaAlphaHelixOligo.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;

    const hBondAtomPairs = event.data.hBondAtomPairs;

    swapViewer.removeAllShapes();

    if ('ribbon' == viewName) {
        swapViewer.setStyle({}, {cartoon:defaults.cartoonStyle});
    } else if ('spheres' == viewName) {
        swapViewer.setStyle({}, {sphere:{colorscheme:defaults.elementColors}});
    } else if ('sticks + H-bonding' == viewName) {
        swapViewer.setStyle({}, {stick:defaults.stickStyle});
        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
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

    var buttonValues = ['ribbon', 'spheres', 'sticks + H-bonding'];

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

        add5Prime3PrimeLabels(swapViewer);

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
