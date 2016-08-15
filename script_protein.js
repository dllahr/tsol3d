$ = jQuery;

/*********************************************
 * setup logger
 * ***************************************/
var logger = log4javascript.getLogger("tsol3dmolLogger");
logger.setLevel(log4javascript.Level.DEBUG);
var appender = new log4javascript.BrowserConsoleAppender();
var layout = new log4javascript.PatternLayout('%-5p %d{HH:mm:ss} - %m{1}%n');
appender.setLayout(layout);
logger.addAppender(appender);
logger.debug("log4javascript is working");


$tsol3d = (function(window) {
	var my = window['$tsol3d'] || {};
	return my;
})(window);

$tsol3d.getViewCoordinates = function(viewer) {
	$('#viewCoordinatesDiv').html(JSON.stringify(viewer.getView()));
};

$tsol3d.helloWorld = function() {
	var message = 'test that $tsol3d has loaded correctly and a function can be called:  hello world!';
	console.log(message);
	logger.debug(message);
};


$tsol3d.defaultElementColors = $.extend({}, $3Dmol.elementColors.defaultColors);
$tsol3d.defaultElementColors['C'] = '0xe7e7e7';
$tsol3d.defaultElementColors['N'] = '0x0070ff';
$tsol3d.defaultElementColors['O'] = '0xF00000';
$tsol3d.defaultElementColors['S'] = '0xFFC832';

$tsol3d.defaultStickStyle = {singleBonds:true, colorscheme:$tsol3d.defaultElementColors};


$tsol3d.defaultCartoonStyle = {style:'oval', outline:true, arrow:true};
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

$tsol3d.hydrophobicityColors = {hydrophobic:'0x97d4db', polar:'0xbce3eb', charged:'0xe1fbff'};
$tsol3d.residueHydrophobicity = {hydrophobic:['Ala','Phe','Ile','Leu','Met','Val','Trp','Tyr','Cys'],
	polar:['Asn','Gln','Ser','Thr','Gly'],
	charged:['His','Lys','Arg','Asp','Glu','Pro']};

$tsol3d.applyHydrophobicColors = function(swapViewer, styleType, baseStyle) {
	var curStyle = $.extend({}, baseStyle);

	for (var hp in $tsol3d.hydrophobicityColors) {
		curStyle['color'] = $tsol3d.hydrophobicityColors[hp];
		residues = $tsol3d.residueHydrophobicity[hp];

		styleMap = {};
		styleMap[styleType] = curStyle;
		swapViewer.setStyle({resn:residues}, styleMap);
	}
};

/**********************************************************
 * build utils
 * *******************************************************/
$tsol3d.buildUtils = (function(window) {
	var my = window['$tsol3d.TIM_6mer_fragment_A73_I78'] || {};
	return my;
})(window);

$tsol3d.buildUtils.buttonHtml = function(value) {
	return '<input type="submit" value="' + value + '" class="btn btn-xs btn-default" />'
};

$tsol3d.buildUtils.initialSetup = function(viewerDivId, adminDivId) {
	var swapViewer = $3Dmol.createViewer(viewerDivId);
	
	var usingAdmin = (typeof adminDivId != 'undefined') && (adminDivId != null);

	return {"swapViewer":swapViewer, "usingAdmin":usingAdmin};
};

$tsol3d.buildUtils.basicButtonSetup = function(buttonValues, buttonsDivId) {
	var buttons = [];

	var buttonsDiv = $('#' + buttonsDivId);
	for (var i = 0; i < buttonValues.length; i++) {
		var bv = buttonValues[i];

		var buttonHtml = $tsol3d.buildUtils.buttonHtml(bv);
		buttonsDiv.append(buttonHtml);
		
		var b = buttonsDiv.children('input[value="' + bv + '"]');
		buttons.push(b);
	}

	return buttons;
};

/***********************************************************
 * admin functions and setup common admin things
 **********************************************************/

$tsol3d.getImage = function(event) {
	var _3dmolCanvas = event.data._3dmolCanvas;
	var staticImageDiv = event.data.staticImageDiv;
	logger.debug('$tsol3d.getImage _3dmolCanvas:  ' + JSON.stringify(_3dmolCanvas) + '  staticImageDiv:  ' + JSON.stringify(staticImageDiv));

	var img = _3dmolCanvas.toDataURL("image/png");
        staticImageDiv.html('<img src="' + img + '"  />');
};

$tsol3d.getViewCoordinates = function(event) {
	var swapViewer = event.data.swapViewer;
	var viewCoordinatesDiv = event.data.viewCoordinatesDiv;

	logger.debug('tsol3d.getViewCoordinates swapViewer:  ' + JSON.stringify(swapViewer) + '  viewCoordinatesDivId:  ' + JSON.stringify(viewCoordinatesDiv));
	viewCoordinatesDiv.html(JSON.stringify(swapViewer.getView()));
};

$tsol3d.commonAdminSetup = function(adminDivId, viewerDivId, swapViewer) {
	logger.debug('$tsol3d.commonAdminSetup adminDivId:  ' + adminDivId + '  viewerDivId:  ' + viewerDivId + 
		'  swapViewer:  ' + JSON.stringify(swapViewer));

	var adminDiv = $('#' + adminDivId);
	adminDiv.append('get things:');

	var captureButtonHtml = $tsol3d.buildUtils.buttonHtml('get image');
	adminDiv.append(captureButtonHtml);

	var getViewCoordinatesButtonHtml = $tsol3d.buildUtils.buttonHtml('get view coordinates');
	adminDiv.append(getViewCoordinatesButtonHtml);

	adminDiv.append('<div id="viewCoordinatesDiv"></div>');
	var viewCoordinatesDiv = $('#' + adminDivId).children('#viewCoordinatesDiv');

	adminDiv.append('<div id="staticImageDiv"></div>');
	var staticImageDiv = $('#' + adminDivId).children('#staticImageDiv');

	var canvases = $('#' + viewerDivId).children('canvas');
	var canvas = canvases[canvases.length - 1];
	var captureButton = adminDiv.children('input[value="get image"]');
	var cbData = {'_3dmolCanvas':canvas, 'staticImageDiv':staticImageDiv};
	captureButton.click(cbData, $tsol3d.getImage);

	var getViewCoordinatesButton = adminDiv.children('input[value="get view coordinates"]');
	var gvcData = {'swapViewer':swapViewer, 'viewCoordinatesDiv':viewCoordinatesDiv};
	getViewCoordinatesButton.click(gvcData, $tsol3d.getViewCoordinates);
};

/************************************************************
 * TIM_6mer_fragment_A73_I78
 ***********************************************************/
$tsol3d.TIM_6mer_fragment_A73_I78 = (function(window) {
	var my = window['$tsol3d.TIM_6mer_fragment_A73_I78'] || {};
	return my;
})(window);


$tsol3d.TIM_6mer_fragment_A73_I78.defaultRibbonOpacity = 0.8;


$tsol3d.TIM_6mer_fragment_A73_I78.colorResidues = function(stylesAndAdditionalSpecMap, swapViewer) {
	var residueColorMap = {73:"0xe7e7e7", 74:"0xacacac", 75:"0xe7e7e7", 76:"0xacacac", 77:"0xe7e7e7", 78:"0xacacac"};

	for (var curResi in residueColorMap) {
		var curColor = residueColorMap[curResi];

		var styleMap = {};
		for (var styleName in stylesAndAdditionalSpecMap) {
			var styleSpec = {color:curColor};
			$.extend(styleSpec, stylesAndAdditionalSpecMap[styleName]);

			styleMap[styleName] = styleSpec;
		}

		swapViewer.setStyle({resi:curResi}, styleMap);
	}
};


$tsol3d.TIM_6mer_fragment_A73_I78.swapView = function(event) {
	var viewName = event.data.viewName;
	logger.debug("$tsol3d.TIM_6mer_fragment_A73_I78.swapView viewName:  " + viewName);

	var swapViewer = event.data.swapViewer;
	swapViewer.removeAllShapes();
	swapViewer.removeAllLabels();
	swapViewer.removeAllSurfaces();
	swapViewer.addResLabels({}, {font:"Helvetica", fontSize:18, fontColor:"black", showBackground:false});

	if ("ribbon" == viewName) {
		$tsol3d.TIM_6mer_fragment_A73_I78.colorResidues({"cartoon":$tsol3d.defaultCartoonStyle}, swapViewer);
	} else if ("stick" == viewName) {
		$tsol3d.TIM_6mer_fragment_A73_I78.colorResidues({"stick":{}}, swapViewer);
		swapViewer.setStyle({elem:"C",invert:true}, {stick:$tsol3d.defaultStickStyle});
	} else if ("stick and ribbon" == viewName) {
		var curCartoonStyle = {'opacity':event.data.opacity()};
		$.extend(curCartoonStyle, $tsol3d.defaultCartoonStyle);
		$tsol3d.TIM_6mer_fragment_A73_I78.colorResidues({stick:{}, cartoon:curCartoonStyle}, swapViewer);
		swapViewer.addStyle({elem:"C",invert:true}, {stick:$tsol3d.defaultStickStyle, cartoon:curCartoonStyle});
	} else if ("spheres" == viewName) {
		swapViewer.setStyle({}, {sphere:{colorscheme:$tsol3d.defaultElementColors}});
	} else if ("surface" == viewName) {
		$tsol3d.TIM_6mer_fragment_A73_I78.colorResidues({"stick":{}}, swapViewer);
		swapViewer.setStyle({elem:"C",invert:true}, {stick:$tsol3d.defaultStickStyle});
		swapViewer.addSurface("VDW", {opacity:0.7, color:"white"}, {});
	}
	swapViewer.render();
};


$tsol3d.TIM_6mer_fragment_A73_I78.adjustStyle = function(event) {
	var styleTestName = event.data.styleTestName;
	logger.debug('$tsol3d.TIM_6mer_fragment_A73_I78.adjustStyle styleTestName:  ' + styleTestName);

	var swapViewer = event.data.swapViewer;
	var split = event.data.styleTestName.split(" ");

	var newEvent = {data:{'swapViewer':swapViewer, viewName:'stick'}};

	if (split[0] == "stick") {
		$tsol3d.TIM_6mer_fragment_A73_I78.swapView(newEvent);
		swapViewer.setStyle({elem:["C"]}, {stick:{color:split[1]}});
		swapViewer.render();
	}

	if (split[0] == "element") {
		$tsol3d.TIM_6mer_fragment_A73_I78.swapView(newEvent);  
		swapViewer.setStyle({elem:["N"]}, {stick:{color:"0x0070ff"}});
		swapViewer.setStyle({elem:["S"]}, {stick:{color:"0xffb900"}});
		swapViewer.setStyle({elem:["O"]}, {stick:{color:"0xdf0000"}});
		swapViewer.render();
	};
};


$tsol3d.TIM_6mer_fragment_A73_I78.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
	var initialSetup = $tsol3d.buildUtils.initialSetup(viewerDivId, adminDivId);
	var swapViewer = initialSetup.swapViewer;
	var usingAdmin = initialSetup.usingAdmin;

	var opacityFun = null;
	if (usingAdmin) {
		logger.debug('adminDivId provided, setting up admin controls - adminDivId:  ' + adminDivId);
		$tsol3d.TIM_6mer_fragment_A73_I78.addStyleControls(adminDivId, swapViewer);
		$tsol3d.commonAdminSetup(adminDivId, viewerDivId, swapViewer);

		opacityFun = function() {
			var inputOpacity = Number($('#' + adminDivId).children("#opacityInputText").val());
			return inputOpacity;
		};
	} else {
		opacityFun = function() {return $tsol3d.TIM_6mer_fragment_A73_I78.defaultRibbonOpacity;};
	}

	var buttonValues = ['stick', 'stick and ribbon', 'ribbon', 'spheres', 'surface'];
	var buttons = $tsol3d.buildUtils.basicButtonSetup(buttonValues, buttonsDivId);
	for (var i = 0; i < buttons.length; i++) {
		var bv = buttonValues[i];
		var b = buttons[i];

		var eventData = {'swapViewer':swapViewer, viewName:bv, opacity:opacityFun};
		b.click(eventData, $tsol3d.TIM_6mer_fragment_A73_I78.swapView);
	}

	if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
		pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_A73-I78.pdb';
	}

	$.ajax({url: pdbUrl, success: function(data) {
		logger.trace('$tsol3d.TIM_6mer_fragment_A73_I78.build retrieved pdb data:  ' + data.substring(0,100));

		swapViewer.addModel(data, "pdb");
		swapViewer.setBackgroundColor(0xffffff);
		$tsol3d.TIM_6mer_fragment_A73_I78.swapView({'data':{'swapViewer':swapViewer, viewName:'stick'}});
		swapViewer.zoomTo();
		swapViewer.zoom(0.95);
		swapViewer.render();
	}});
};


$tsol3d.TIM_6mer_fragment_A73_I78.addStyleControls = function(adminDivId, swapViewer) {
	var adminDiv = $('#' + adminDivId);

	var buttonValues = ["stick 0xcccccc", "stick 0xe7e7e7", "stick 0xffffff", "element coloring"];
	for (var i = 0; i < buttonValues.length; i++) {
		var bv = buttonValues[i];
		var buttonHtml = $tsol3d.buildUtils.buttonHtml(bv);
		adminDiv.append(buttonHtml);

		var b = adminDiv.children('input[value="' + bv + '"]');
		var eventData = {'swapViewer':swapViewer, styleTestName:bv};
		b.click(eventData, $tsol3d.TIM_6mer_fragment_A73_I78.adjustStyle);
	}

	adminDiv.append('<br/>');
	var opacityHtml = 'opacity of ribbon in stick and ribbon view:  <input type="text" id="opacityInputText" value="' +
		$tsol3d.TIM_6mer_fragment_A73_I78.defaultRibbonOpacity + '"/>';
	adminDiv.append(opacityHtml);
	adminDiv.append('<br/>');
};


/**********************************************
 * TIM_fragment_alpha_helix_Q19_N29
 *********************************************/
$tsol3d.TIM_fragment_alpha_helix_Q19_N29 = (function(window) {
	var my = window['$tsol3d.TIM_fragment_alpha_helix_Q19_N29'] || {};
	return my;
})(window);

$tsol3d.TIM_fragment_alpha_helix_Q19_N29.hbondAtomPairs = [[291, 348], [274, 334], [302, 367], [321, 382], [328, 392], [343, 407], [362, 426]];


$tsol3d.TIM_fragment_alpha_helix_Q19_N29.swapView = function(event) {
	var viewName = event.data.viewName;
	logger.debug("$tsol3d.TIM_fragment_alpha_helix_Q19_N29.swapView viewName:  " + viewName);

	var swapViewer = event.data.swapViewer;
	var pdbData = event.data.pdbData;

	swapViewer.removeAllModels();
	swapViewer.removeAllShapes();

	if ('ribbon' == viewName) {
		swapViewer.addModel(pdbData, 'pdb');
		swapViewer.setStyle({}, {cartoon:$tsol3d.defaultCartoonStyle});
	} else if ('stick and ribbon' == viewName) {
		swapViewer.addModel(pdbData, 'pdb');
		var curCartoonStyle = {opacity:$tsol3d.defaultCartoonOpacity};
		$.extend(curCartoonStyle, $tsol3d.defaultCartoonStyle);
		swapViewer.setStyle({}, {cartoon:curCartoonStyle, stick:$tsol3d.defaultStickStyle});
	} else if ('stick' == viewName) {
		swapViewer.addModel(pdbData, 'pdb');
		swapViewer.setStyle({}, {stick:$tsol3d.defaultStickStyle});
	} else if ('backbone H-bonding' == viewName) {
		swapViewer.addModel(pdbData, 'pdb', {keepH:true});
		swapViewer.setStyle({atom:['CA','C','N','H','O']}, {stick:$tsol3d.defaultStickStyle});
		swapViewer.setStyle({atom:['CA','C','N','H','O'], invert:true}, {stick:{hidden:true}});
		$tsol3d.addHBonds(swapViewer, $tsol3d.TIM_fragment_alpha_helix_Q19_N29.hbondAtomPairs);
	} else if ('ribbon H-bonding' == viewName) {
		swapViewer.addModel(pdbData, 'pdb', {keepH:true});
		swapViewer.setStyle({}, {cartoon:$tsol3d.defaultCartoonStyle});
		$tsol3d.addHBonds(swapViewer, $tsol3d.TIM_fragment_alpha_helix_Q19_N29.hbondAtomPairs);
	}

	swapViewer.render();
};

$tsol3d.TIM_fragment_alpha_helix_Q19_N29.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
	var initialSetup = $tsol3d.buildUtils.initialSetup(viewerDivId, adminDivId);
	var swapViewer = initialSetup.swapViewer;
	var usingAdmin = initialSetup.usingAdmin;

	if (usingAdmin) {
		$tsol3d.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
	}

	var buttonValues = ['stick', 'ribbon', 'stick and ribbon', 'backbone H-bonding', 'ribbon H-bonding'];
	var buttons = $tsol3d.buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

	if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
		pdbUrl = "https://www.secretoflife.org/sites/default/files/pdb/4poc Q19-N29 alpha-helix.pdb";
	}

	$.ajax({url: pdbUrl, success: function(pdbData) {
		logger.trace('$tsol3d.TIM_fragment_alpha_helix_Q19_N29.build retrieved pdbData:  ' + pdbData.substring(0,100));

		for (var i = 0; i < buttons.length; i++) {
			var bv = buttonValues[i];
			var b = buttons[i];

			var eventData = {'swapViewer':swapViewer, viewName:bv, "pdbData":pdbData};
			b.click(eventData, $tsol3d.TIM_fragment_alpha_helix_Q19_N29.swapView);
		}

		swapViewer.setBackgroundColor(0xffffff);
		$tsol3d.TIM_fragment_alpha_helix_Q19_N29.swapView({'data':{'swapViewer':swapViewer, viewName:'stick', 'pdbData':pdbData}});
		swapViewer.setView([-25.5488,8.0181,-3.7173,79.6871,0.3267,0.6791,-0.3059,-0.5817]);
		swapViewer.render();
	}});
};

