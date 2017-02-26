import defaults from './defaults';


export default function biochemStyling() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const defaultHBondLineStyle = {
    dashed:true,
    linewidth:1,
    dashLength:0.25,
    gapLength:0.25
};

biochemStyling.addHBonds = function(swapViewer, atomPairSerialNumbers) {
    var myModel = swapViewer.getModel();

    for (var i = 0; i < atomPairSerialNumbers.length; i++) {
        var pairAtoms = myModel.selectedAtoms({serial:atomPairSerialNumbers[i]});
        logger.debug('biochemStyling.addHBonds pairAtoms.length:  ' + pairAtoms.length);

        var p0 = pairAtoms[0];
        var p1 = pairAtoms[1];

        var hBondLineStyle = $.extend({
            start:{x:p0.x, y:p0.y, z:p0.z},
            end:{x:p1.x, y:p1.y, z:p1.z}
        }, defaultHBondLineStyle);
        logger.debug("hBondLineStyle:  " + JSON.stringify(hBondLineStyle));

        swapViewer.addLine(hBondLineStyle);
    }
};


biochemStyling.applyHydrophobicityColors = function(swapViewer, styleType, baseStyle, hydrophobicityColors) {
    if (typeof hydrophobicityColors == 'undefined' || hydrophobicityColors == null) {
        hydrophobicColors = defaults.hydrophobicityColors;
    }

    var curStyle = $.extend({}, baseStyle);

    for (var hp in hydrophobicityColors) {
        curStyle['color'] = hydrophobicityColors[hp];
        var residues = defaults.residueHydrophobicity[hp];

        var styleMap = {};
        styleMap[styleType] = curStyle;
        swapViewer.setStyle({resn:residues}, styleMap);
    }
};


biochemStyling.fragmentSwapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug("biochemStyling.fragmentSwapView viewName:  " + viewName);

    var swapViewer = event.data.swapViewer;
    var pdbData = event.data.pdbData;
    var hbondAtomPairs = event.data.hbondAtomPairs;

    swapViewer.removeAllModels();
    swapViewer.removeAllShapes();

    if ('ribbon' == viewName) {
        swapViewer.addModel(pdbData, 'pdb');
        swapViewer.setStyle({}, {cartoon:defaults.cartoonStyle});
    } else if ('ribbon + sticks' == viewName) {
        swapViewer.addModel(pdbData, 'pdb');
        var curCartoonStyle = {opacity:defaults.cartoonOpacity};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        swapViewer.setStyle({}, {cartoon:curCartoonStyle, stick:defaults.stickStyle});
    } else if ('sticks' == viewName) {
        swapViewer.addModel(pdbData, 'pdb');
        swapViewer.setStyle({}, {stick:defaults.StickStyle});
    } else if ('backbone sticks + H-bonding' == viewName) {
        swapViewer.addModel(pdbData, 'pdb', {keepH:true});
        swapViewer.setStyle({atom:['CA','C','N','H','O']}, {stick:defaults.stickStyle});
        swapViewer.setStyle({atom:['CA','C','N','H','O'], invert:true}, {stick:defaults.hiddenStyle});
        biochemStyling.addHBonds(swapViewer, hbondAtomPairs);
    } else if ('ribbon + H-bonding' == viewName) {
        swapViewer.addModel(pdbData, 'pdb', {keepH:true});
        swapViewer.setStyle({}, {cartoon:defaults.cartoonStyle});
        biochemStyling.addHBonds(swapViewer, hbondAtomPairs);
    } else if ('ribbon + backbone sticks' == viewName) {
        swapViewer.addModel(pdbData, 'pdb');
        var curCartoonStyle = {opacity:defaults.cartoonOpacity};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        swapViewer.setStyle({atom:['CA','C','N','H','O']}, {cartoon:curCartoonStyle,
            stick:defaults.stickStyle});
        swapViewer.setStyle({atom:['CA','C','N','H','O'], invert:true}, {cartoon:curCartoonStyle,
            stick:defaults.hiddenStyle});

        var myModel = swapViewer.getModel();
        var atom = myModel.selectedAtoms({serial:275})[0];
        var labelData = $.extend({
            position: {
                x: atom.x, // + 2.2
                y: atom.y,
                z: atom.z// + 0.7
            },
            inFront: false
        }, defaults.residueLabelStyle);
        console.log(labelData.position);
        /*swapViewer.addSphere({
            center: {
                x: atom.x,
                y: atom.y,
                z: atom.z
            },
            radius: 1.0,
            alpha: 0.5
        });*/
        var myLabel = swapViewer.addLabel('R', labelData);
        console.log('myLabel:');
        console.log(myLabel);
    }

    swapViewer.render();
};
