$ = jQuery;

$tsol3d = (function(window) {
	var my = window['$tsol3d'] || {};
	return my;
})(window);

$tsol3d.getViewCoordinates = function(viewer) {
	$("#viewCoordinatesDiv").html(JSON.stringify(viewer.getView()));
};

$tsol3d.helloWorld = function() {
	console.log("hello world!");
};


$tsol3d.defaultElementColors = $.extend({}, $3Dmol.elementColors.defaultColors);
$tsol3d.defaultElementColors["C"] = "0xe7e7e7";
$tsol3d.defaultElementColors["N"] = "0x0070ff";
$tsol3d.defaultElementColors["O"] = "0xF00000";
$tsol3d.defaultElementColors["S"] = "0xFFC832";

$tsol3d.defaultStickStyle = {singleBonds:true, colorscheme:$tsol3d.defaultElementColors};


$tsol3d.defaultCartoonStyle = {style:"oval", outline:true, arrow:true};
$tsol3d.defaultCartoonOpacity = 0.8;


$tsol3d.addHBonds = function(swapViewer, atomPairSerialNumbers) {
	var myModel = swapViewer.getModel();


	for (var i = 0; i < atomPairSerialNumbers.length; i++) {
		var pairAtoms = myModel.selectedAtoms({serial:atomPairSerialNumbers[i]});

		var p0 = pairAtoms[0];
		var p1 = pairAtoms[1];
										
		swapViewer.addLine({dashed:true, start:{x:p0.x, y:p0.y, z:p0.z}, end:{x:p1.x, y:p1.y, z:p1.z},
			linewidth:10, dashLength:0.25, gapLength:0.25});
	}
};

$tsol3d.hydrophobicityColors = {hydrophobic:"0x97d4db", polar:"0xbce3eb", charged:"0xe1fbff"};
$tsol3d.residueHydrophobicity = {hydrophobic:["Ala","Phe","Ile","Leu","Met","Val","Trp","Tyr","Cys"],
	polar:["Asn","Gln","Ser","Thr","Gly"],
	charged:["His","Lys","Arg","Asp","Glu","Pro"]};

$tsol3d.applyHydrophobicColors = function(swapViewer, styleType, baseStyle) {
	var curStyle = $.extend({}, baseStyle);

	for (var hp in $tsol3d.hydrophobicityColors) {
		curStyle["color"] = $tsol3d.hydrophobicityColors[hp];
		residues = $tsol3d.residueHydrophobicity[hp];

		styleMap = {};
		styleMap[styleType] = curStyle;
		swapViewer.setStyle({resn:residues}, styleMap);
	}
};

