import defaults from './defaults';
import buildUtils from './buildUtils';
import admin from './admin';


export default function tim6merFragmentA73I78() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


tim6merFragmentA73I78.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    var opacityFun = null;
    if (usingAdmin) {
        logger.debug('adminDivId provided, setting up admin controls - adminDivId:  ' + adminDivId);
        addStyleControls(adminDivId, swapViewer);
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);

        opacityFun = function() {
            var inputOpacity = Number($('#' + adminDivId).children("#opacityInputText").val());
            return inputOpacity;
        };
    } else {
        opacityFun = function() {return defaults.cartoonOpacity;};
    }

    var buttonValues = ['stick', 'sticks + ribbon', 'ribbon', 'spheres', 'sticks + surface'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);
    for (var i = 0; i < buttons.length; i++) {
        var bv = buttonValues[i];
        var b = buttons[i];

        var eventData = {'swapViewer':swapViewer, viewName:bv, opacity:opacityFun};
        b.click(eventData, swapView);
    }

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_A73-I78.pdb';
    }

    $.ajax({url: pdbUrl, success: function(data) {
        logger.trace('tim6merFragmentA73I78.build retrieved pdb data:  ' + data.substring(0,100));

        swapViewer.addModel(data, "pdb");

        swapView({'data':{'swapViewer':swapViewer, viewName:'stick'}});

        swapViewer.setView([-12.462,-4.1474,-26.124,95.808,0.45268,0.3443,-0.4976,-0.6550]);

        swapViewer.render();
    }});
};


const colorResidues = function(stylesAndAdditionalSpecMap, swapViewer) {
    //setup residueColorMap with alternating shades of gray
    var residueColorMap = {};
    for (var resi = 73; resi <= 78; resi++) {
        if ((resi % 2) == 0) {
            residueColorMap[resi] = '0x848484';
        } else {
            residueColorMap[resi] = '0xdadada';
        }
    }

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

const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug("tim6merFragmentA73I78.swapView viewName:  " + viewName);

    var swapViewer = event.data.swapViewer;
    swapViewer.removeAllShapes();
    swapViewer.removeAllLabels();
    swapViewer.removeAllSurfaces();
    swapViewer.addResLabels({}, defaults.residueLabelStyle);

    if ("ribbon" == viewName) {
        colorResidues({"cartoon":defaults.cartoonStyle}, swapViewer);
    } else if ("stick" == viewName) {
        colorResidues({"stick":{}}, swapViewer);
        swapViewer.setStyle({elem:"C",invert:true}, {stick:defaults.stickStyle});
    } else if ("sticks + ribbon" == viewName) {
        var curCartoonStyle = {'opacity':event.data.opacity()};
        $.extend(curCartoonStyle, defaults.cartoonStyle);
        colorResidues({stick:{}, cartoon:curCartoonStyle}, swapViewer);
        swapViewer.addStyle({elem:"C",invert:true}, {stick:defaults.stickStyle, cartoon:curCartoonStyle});
    } else if ("spheres" == viewName) {
        swapViewer.setStyle({}, {sphere:{colorscheme:defaults.elementColors}});
    } else if ("sticks + surface" == viewName) {
        colorResidues({"stick":{}}, swapViewer);
        swapViewer.setStyle({elem:"C",invert:true}, {stick:defaults.stickStyle});
        swapViewer.addSurface("VDW", {opacity:0.7, color:"white"}, {});
    }
    swapViewer.render();
};


const adjustStyle = function(event) {
    var styleTestName = event.data.styleTestName;
    logger.debug('tim6merFragmentA73I78.adjustStyle styleTestName:  ' + styleTestName);

    var swapViewer = event.data.swapViewer;
    var split = event.data.styleTestName.split(" ");

    var newEvent = {data:{'swapViewer':swapViewer, viewName:'stick'}};

    if (split[0] == "stick") {
        swapView(newEvent);
        swapViewer.setStyle({elem:["C"]}, {stick:{color:split[1]}});
        swapViewer.render();
    }

    if (split[0] == "element") {
        swapView(newEvent);
        swapViewer.setStyle({elem:["N"]}, {stick:{color:"0x0070ff"}});
        swapViewer.setStyle({elem:["S"]}, {stick:{color:"0xffb900"}});
        swapViewer.setStyle({elem:["O"]}, {stick:{color:"0xdf0000"}});
        swapViewer.render();
    };
};


const addStyleControls = function(adminDivId, swapViewer) {
    var adminDiv = $('#' + adminDivId);

    var buttonValues = ["stick 0xcccccc", "stick 0xe7e7e7", "stick 0xffffff", "element coloring"];
    for (var i = 0; i < buttonValues.length; i++) {
        var bv = buttonValues[i];
        var buttonHtml = buildUtils.buttonHtml(bv);
        adminDiv.append(buttonHtml);

        var b = adminDiv.children('input[value="' + bv + '"]');
        var eventData = {'swapViewer':swapViewer, styleTestName:bv};
        b.click(eventData, adjustStyle);
    }

    adminDiv.append('<br/>');
    var opacityHtml = 'opacity of ribbon in stick and ribbon view:  <input type="text" id="opacityInputText" value="' +
        defaults.cartoonOpacity + '"/>';
    adminDiv.append(opacityHtml);
    adminDiv.append('<br/>');
};
