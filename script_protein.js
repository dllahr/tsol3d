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

$tsol3d.defaultCartoonStyle = {style:"oval", outline:true};

