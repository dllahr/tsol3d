import defaults from './defaults';


export default function biochemStyling() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const defaultHBondLineStyle = {
    dashed: true,
    radius: 0.05,
    dashLength: 0.25,
    gapLength: 0.25,
    toCap: 1,
    fromCap: 1,
};

const rLabelPositionScale = 1.4;

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
        logger.trace("hBondLineStyle:  " + JSON.stringify(hBondLineStyle));

        swapViewer.addCylinder(hBondLineStyle);
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
    logger.debug('biochemStyling.fragmentSwapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;
    var pdbData = event.data.pdbData;
    var hbondAtomPairs = event.data.hbondAtomPairs;

    swapViewer.removeAllModels();
    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();

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
        addRGroupLabels(swapViewer);
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
        addRGroupLabels(swapViewer);
    }

    swapViewer.render();
};


const addRGroupLabels = function(swapViewer) {
    var labelData = $.extend({
        inFront: false,
        alignment: 'center'
    }, defaults.residueLabelStyle);

    var myModel = swapViewer.getModel();
    var allAtoms = myModel.selectedAtoms({});
    var atoms = myModel.selectedAtoms({atom:'CB'});

    for (var i = 0; i < atoms.length; i++) {
        var curAtom = atoms[i];

        var bondedAtom = null;
        for (var j = 0; j < curAtom.bonds.length; j++) {
            var bondedAtomIndex = curAtom.bonds[j];
            if (allAtoms[bondedAtomIndex].atom == 'CA') {
                bondedAtom = allAtoms[bondedAtomIndex];
            }
        }

        if (bondedAtom != null) {
            var bondX = curAtom.x - bondedAtom.x;
            var bondY = curAtom.y - bondedAtom.y;
            var bondZ = curAtom.z - bondedAtom.z;

            var position = {
                x: rLabelPositionScale * bondX + bondedAtom.x,
                y: rLabelPositionScale * bondY + bondedAtom.y,
                z: rLabelPositionScale * bondZ + bondedAtom.z
            };
            labelData['position'] = position;

            swapViewer.addLabel('R', labelData); //{serial:curAtom.serial}
        } else {
            logger.warning('biochemStyling.fragmentSwapView ribbon + backbone sticks view could not find bonded CA atom to correctly position R label - curAtom:  ' + JSON.stringify(curAtom));
        }
    }
}
