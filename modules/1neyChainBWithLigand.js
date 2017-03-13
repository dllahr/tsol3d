import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';


export default function _1neyChainBWithLigand() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const myDefaults = {surfaceOpacity:1.0, color:'0x33a4e6'};


_1neyChainBWithLigand.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    logger.debug('$_1neyChainBWithLigand.build');

    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        addStyleControls(adminDivId, swapViewer);
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['TIM (surface)', 'TIM (surface) + DHAP (sticks)', 'TIM (surface) + DHAP (spheres)'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/1ney_cleanedHETATM_justChainB.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('_1neyChainBWithLigand.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb");

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv};
            b.click(eventData, swapView);
        }

        drawSurface(swapViewer);
        swapViewer.setStyle({}, {stick:defaults.hiddenStyle});

        swapView({'data':{'swapViewer':swapViewer, viewName:buttonValues[0]}});

        swapViewer.setView([-58.8,-43.6,-19.7,82.3,-0.1307,0.989,0.0275,-0.06288]);

        swapViewer.render();
    }});
};


const drawSurface = function(swapViewer, curOpacity, curColor) {
    if (typeof(curOpacity) == 'undefined' || null == curOpacity) {
        curOpacity = myDefaults['surfaceOpacity'];
    }
    if (typeof(curColor) == 'undefined' || null == curColor) {
        curColor = myDefaults['color'];
    }

    swapViewer.removeAllSurfaces();
        swapViewer.addSurface($3Dmol.SurfaceType.VDW, {opacity:curOpacity, color:curColor}, {resn:"13P", invert:true});
};


const addStyleControls = function(adminDivId, swapViewer) {
    var adminDiv = $('#' + adminDivId);

    var defaultOpacity = myDefaults['surfaceOpacity'];
    var defaultColor = myDefaults['color'];

    adminDiv.append('surface parameters - ');
    adminDiv.append('opacity:  <input type="text" id="surfaceOpacityInput" value="' + defaultOpacity + '"/>');
    adminDiv.append('color:  <input type="text" id="surfaceColorInput" value="' + defaultColor + '"/>');
    adminDiv.append('<input type="submit" value="redraw surface" /><br/>');

    var redrawSurfaceButton = adminDiv.children('input[value="redraw surface"]');
    redrawSurfaceButton.click(function() {
        var curOpacity = adminDiv.children('#surfaceOpacityInput').val();
        var curColor = adminDiv.children('#surfaceColorInput').val();
        drawSurface(swapViewer, curOpacity, curColor);
    });
};


const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('_1neyChainBWithLigand.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;

    if ('TIM (surface)' == viewName) {
        swapViewer.setStyle({resn:"13P"}, {stick:defaults.hiddenStyle});
    } else if ('TIM (surface) + DHAP (sticks)' == viewName) {
        swapViewer.setStyle({resn:"13P"}, {stick:defaults.stickStyle});
    } else if ('TIM (surface) + DHAP (spheres)' == viewName) {
        swapViewer.setStyle({resn:"13P"}, {sphere:{colorscheme:defaults.elementColors}});
    }

    swapViewer.render();
};
