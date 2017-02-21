import buildUtils from './buildUtils';
import admin from './admin';
import biochemStyling from './biochemStyling';


export default function timFragmentAlphaHelixQ19N29() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


timFragmentAlphaHelixQ19N29.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    var buttonValues = ['ribbon + sticks', 'ribbon + backbone sticks', 'backbone sticks + H-bonding', 'ribbon + H-bonding', 'ribbon', 'sticks'];
    var buttons = buildUtils.basicButtonSetup(buttonValues, buttonsDivId);

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc Q19-N29 alpha-helix.pdb';
    }

    var hbondAtomPairs = [[291, 348], [274, 334], [302, 367], [321, 382], [328, 392], [343, 407], [362, 426]];

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('timFragmentAlphaHelixQ19N29.build retrieved pdbData:  ' + pdbData.substring(0,100));

        for (var i = 0; i < buttons.length; i++) {
            var bv = buttonValues[i];
            var b = buttons[i];

            var eventData = {'swapViewer':swapViewer, viewName:bv, "pdbData":pdbData, "hbondAtomPairs":hbondAtomPairs};
            b.click(eventData, biochemStyling.fragmentSwapView);
        }

        swapViewer.setBackgroundColor(0xffffff);
        biochemStyling.fragmentSwapView({'data':{'swapViewer':swapViewer, viewName:'ribbon + sticks', 'pdbData':pdbData, "hbondAtomPairs":hbondAtomPairs}});
        swapViewer.setView([-25.549,8.018,-3.717,75.986,-0.0653,-0.8458,0.2518,0.4659]);
        swapViewer.render();
    }});
};
