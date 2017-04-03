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

const groupColorsSelection = {
    '#c8e8ff': {atom: ['P', 'O1P', 'O2P']}, //'#CCEAFF'
    '#99b7ff': {atom:['C1\'', 'C2\'', 'C3\'', 'O3\'', 'C4\'', 'O4\'', //'#B8CFFF'
        'C5\'', 'O5\'']}
};

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

const ribbonColorSelection = {
    '#4593ff': {atom:['C1\'', 'C2\'', 'C3\'', 'O3\'', 'C4\'', 'O4\'', //'#2B8BFF'
        'C5\'', 'O5\'', 'P', 'O1P', 'O2P']}
};
//copy the dictionary of atoms from above, add inversion to selection, for the
//other color used in the ribbon
ribbonColorSelection['#93cfff'] = $.extend({invert:true}, //'#86BAE5'
    ribbonColorSelection['#4593ff']);  //'#2B8BFF'


const colorByGroup = function(swapViewer, baseStyles) {
    for (var styleName in baseStyles) {
        var baseStyle = baseStyles[styleName];
        var curStyle = $.extend({}, baseStyle);
        if ('colorscheme' in curStyle) {
            delete curStyle.colorscheme;
        }
        for (var base in baseColors) {
            curStyle['color'] = baseColors[base];

            var fullStyle = {};
            fullStyle[styleName] = curStyle;
            logger.trace('fullStyle:  ' + JSON.stringify(fullStyle));

            swapViewer.setStyle({resn:base}, fullStyle);
        }

        for (var color in groupColorsSelection) {
            var selection = groupColorsSelection[color];

            curStyle['color'] = color;

            var fullStyle = {};
            fullStyle[styleName] = curStyle;

            swapViewer.setStyle(selection, fullStyle);
        }
    }
};

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

const colorRibbon = function(swapViewer, baseStyles) {
    for (var styleName in baseStyles) {
        var baseStyle = baseStyles[styleName];
        var curStyle = $.extend({}, baseStyle);

        for (var color in ribbonColorSelection) {
            var selection = ribbonColorSelection[color];

            curStyle['color'] = color;

            var fullStyle = {};
            fullStyle[styleName] = curStyle;

            swapViewer.setStyle(selection, fullStyle);
        }
    }
};

const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('dnaAlphaHelixOligo.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;

    const hBondAtomPairs = event.data.hBondAtomPairs;

    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();

    if ('color by group ribbons' == viewName) {
        colorRibbon(swapViewer, {cartoon:defaults.cartoonStyle});
        add5Prime3PrimeLabels(swapViewer);
    } else if ('color by element spheres' == viewName) {
        swapViewer.setStyle({}, {sphere:{colorscheme:defaults.elementColors}});
        add5Prime3PrimeLabels(swapViewer);
    } else if ('color by element double helix' == viewName) {
        swapViewer.setStyle({}, {stick:defaults.stickStyle});
        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
        add5Prime3PrimeLabels(swapViewer);
    } else if ('color by element nucleotide: A' == viewName) {
        swapViewer.setStyle({resi:9, invert:true}, {stick:defaults.hiddenStyle});
        swapViewer.setStyle({resi:9}, {stick:defaults.stickStyle});
    } else if ('color by element strand' == viewName) {
        swapViewer.setStyle({chain:'A', invert:true}, {stick:defaults.hiddenStyle});
        swapViewer.setStyle({chain:'A'}, {stick:defaults.stickStyle});
        add5Prime3PrimeLabels(swapViewer, [1, 355]);
    } else if ('color by group nucleotide: A' == viewName) {
        colorByGroup(swapViewer, {stick:defaults.stickStyle});
        var specialHiddenStyle = $.extend({}, defaults.hiddenStyle);
        delete specialHiddenStyle.colorscheme;
        specialHiddenStyle['color'] = '#c8e8ff';
        swapViewer.setStyle({resi:9, invert:true}, {stick:specialHiddenStyle});
    } else if ('color by group strand' == viewName) {
        colorByGroup(swapViewer, {stick:defaults.stickStyle});
        swapViewer.setStyle({chain:'A', invert:true}, {stick:defaults.hiddenStyle});
        add5Prime3PrimeLabels(swapViewer, [1, 355]);
    } else if ('color by group double helix' == viewName) {
        colorByGroup(swapViewer, {stick:defaults.stickStyle});
        biochemStyling.addHBonds(swapViewer, hBondAtomPairs);
        add5Prime3PrimeLabels(swapViewer);
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

    var colorByGroupButtonValueViewNames = {
        'double helix': 'color by group double helix',
        'strand': 'color by group strand',
        'nucleotide: A': 'color by group nucleotide: A',
        'ribbons':  'color by group ribbons'
    };
    var colorByGroupButtonValues = Object.keys(colorByGroupButtonValueViewNames);

    var colorByElementButtonValueViewNames = {
        'double helix': 'color by element double helix',
        'strand': 'color by element strand',
        'nucleotide: A': 'color by element nucleotide: A',
        'spheres': 'color by element spheres'
    };
    var colorByElementButtonValues = Object.keys(colorByElementButtonValueViewNames);

    var buttonsDiv = $('#' + buttonsDivId);
    buttonsDiv.append('<div id="buttonsColorByGroupDiv">color by group:</div>');
    buttonsDiv.append('<div id="buttonsColorByElementDiv">color by element:</div>');

    var colorByGroupButtons = buildUtils.basicButtonSetup(
        colorByGroupButtonValues, 'buttonsColorByGroupDiv');
    var colorByElementButtons = buildUtils.basicButtonSetup(
        colorByElementButtonValues, 'buttonsColorByElementDiv');

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/DNAv2.pdb';
    }

    for (var i = 0; i < colorByGroupButtonValues.length; i++) {
        var bv = colorByGroupButtonValues[i];
        var vn = colorByGroupButtonValueViewNames[bv];
        var b = colorByGroupButtons[i];

        var eventData = {'swapViewer':swapViewer, viewName:vn, 'hBondAtomPairs':hBondAtomPairs};
        b.click(eventData, swapView);
    }

    for (var i = 0; i < colorByElementButtonValues.length; i++) {
        var bv = colorByElementButtonValues[i];
        var vn = colorByElementButtonValueViewNames[bv];
        var b = colorByElementButtons[i];

        var eventData = {'swapViewer':swapViewer, viewName:vn, 'hBondAtomPairs':hBondAtomPairs};
        b.click(eventData, swapView);
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('dnaAlphaHelixOligo.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, 'pdb');

        swapView({'data':{'swapViewer':swapViewer, viewName:'color by group double helix',
            'hBondAtomPairs':hBondAtomPairs}});

        swapViewer.setView([-5.4222,-4.8156,29.8175,-43.174,0.6188,-0.4064,-0.3732,-0.5592]);
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
