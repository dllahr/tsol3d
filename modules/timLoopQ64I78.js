import buildUtils from './buildUtils';
import admin from './admin';
import biochemStyling from './biochemStyling';


export default function timLoopQ64I78() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


timLoopQ64I78.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['ribbon + sticks', 'ribbon', 'sticks'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc Q64-I78 loop.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('timLoopQ64I78.build retrieved pdbData:  ' + pdbData.substring(0,100));

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, "pdbData":pdbData, "hbondAtomPairs":null};
            b.click(eventData, biochemStyling.fragmentSwapView);
        }

        biochemStyling.fragmentSwapView({'data':{'swapViewer':swapViewer, viewName:'ribbon + sticks', 'pdbData':pdbData, "hbondAtomPairs":null}});
        swapViewer.setView([-11.313,-1.57,-22.294,60.643,0.2455,0.1597,-0.3977,-0.8695]);
        swapViewer.render();
    }});
};
