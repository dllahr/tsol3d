import buildUtils from './buildUtils';
import admin from './admin';
import biochemStyling from './biochemStyling';


export default function timFragmentParallelBetaSheetF6A42() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


timFragmentParallelBetaSheetF6A42.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['ribbon + sticks', 'ribbon + backbone sticks', 'backbone sticks + H-bonding', 'ribbon + H-bonding', 'ribbon', 'sticks'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc F6-A42 parallel beta-sheet.pdb';
    }

    var hbondAtomPairs = [[60,549],[543,104],[100,578],[574,124],[123,603],[601,155]];

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('timFragmentParallelBetaSheetF6A42.build retrieved pdbData:  ' + pdbData.substring(0,100));

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, "pdbData":pdbData, "hbondAtomPairs":hbondAtomPairs};
            b.click(eventData, biochemStyling.fragmentSwapView);
        }

        swapViewer.setBackgroundColor(0xffffff);
        biochemStyling.fragmentSwapView({'data':{'swapViewer':swapViewer, viewName:'ribbon + sticks', 'pdbData':pdbData, "hbondAtomPairs":hbondAtomPairs}});
        swapViewer.setView([-18.086,9.677,-4.584,41.386,-0.2834,-0.4869,-0.0164,-0.826]);
        swapViewer.render();
    }});
};
