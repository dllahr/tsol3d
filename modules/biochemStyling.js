import defaults from './defaults.js';


export default function biochemStyling() {};


biochemStyling.addHBonds = function(swapViewer, atomPairSerialNumbers) {
    var myModel = swapViewer.getModel();

    for (var i = 0; i < atomPairSerialNumbers.length; i++) {
        var pairAtoms = myModel.selectedAtoms({serial:atomPairSerialNumbers[i]});
        //logger.debug('biochemStyling.addHBonds pairAtoms.length:  ' + pairAtoms.length);

        var p0 = pairAtoms[0];
        var p1 = pairAtoms[1];

        swapViewer.addLine({dashed:true, start:{x:p0.x, y:p0.y, z:p0.z}, end:{x:p1.x, y:p1.y, z:p1.z},
            linewidth:10, dashLength:0.25, gapLength:0.25});
    }
};


biochemStyling.applyHydrophobicityColors = function(swapViewer, styleType, baseStyle, hydrophobicityColors) {
    if (typeof hydrophobicityColors == 'undefined' || hydrophobicityColors == null) {
        hydrophobicColors = defaults.hydrophobicityColors;
    }

    var curStyle = $.extend({}, baseStyle);

    for (var hp in hydrophobicityColors) {
        curStyle['color'] = hydrophobicityColors[hp];
        residues = defaults.residueHydrophobicity[hp];

        styleMap = {};
        styleMap[styleType] = curStyle;
        swapViewer.setStyle({resn:residues}, styleMap);
    }
};
