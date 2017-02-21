import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';


export default function _1neyChainBWithLigandAndResidues() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const myDefaults = {surfaceOpacity:0.7, color:'0x33a4e6'};

const data = {resi:[165, 95]};


_1neyChainBWithLigandAndResidues.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    logger.debug('_1neyChainBWithLigandAndResidues.build');
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        addStyleControls(adminDivId, swapViewer);
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['TIM (surface) + Glu165,His95 (sticks) + DHAP (sticks)', 'TIM (surface) + Glu165,His95 (spheres) + DHAP (spheres)'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof(pdbUrl) == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/1ney_cleanedHETATM_justChainB.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('_1neyChainBWithLigandAndResidues.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb", {keepH:true});

        var residueIndexes = data['resi'];

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, 'resi':residueIndexes};
            b.click(eventData, swapView);
        }

        swapViewer.setBackgroundColor(0xffffff);

        swapViewer.setStyle({}, {stick:defaults.hiddenStyle});
        drawSurface(swapViewer);

        var curEvent = {'data':{'swapViewer':swapViewer, viewName:buttonValues[0], 'resi':residueIndexes}};
        swapView(curEvent);

        swapViewer.addResLabels({resi:residueIndexes}, defaults.residueLabelStyle);

        swapViewer.setView([-58.8,-45.5,-13.7,91.6,0.0356,-0.978,-0.0799,0.191]);
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
_1neyChainBWithLigandAndResidues.drawSurface = drawSurface;


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
_1neyChainBWithLigandAndResidues.addStyleControls = addStyleControls;


const swapView = function(event) {
    var viewName = event.data.viewName;
    logger.debug('_1neyChainBWithLigandAndResidues.swapView viewName:  ' + viewName);

    var swapViewer = event.data.swapViewer;

    var residueIndexes = event.data.resi;

    if ('TIM (surface) + Glu165,His95 (sticks) + DHAP (sticks)' == viewName) {
        swapViewer.setStyle({resn:"13P"}, {stick:defaults.stickStyle});
        swapViewer.setStyle({resi:residueIndexes}, {stick:defaults.stickStyle});
    } else if ('TIM (surface) + Glu165,His95 (spheres) + DHAP (spheres)' == viewName) {
        swapViewer.setStyle({resn:"13P"}, {sphere:{colorscheme:defaults.elementColors}});
        swapViewer.setStyle({resi:residueIndexes}, {sphere:{colorscheme:defaults.elementColors}});
    }

    swapViewer.render();
};
