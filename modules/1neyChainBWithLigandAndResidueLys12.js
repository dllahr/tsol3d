import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';
import biochemStyling from './biochemStyling';
import _1neyChainBWithLigandAndResidues from './1neyChainBWithLigandAndResidues';


export default function _1neyChainBWithLigandAndResidueLys12() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const data = {resi:[12], hBondPairs:[[3980,7655], [3980,7652]]};


_1neyChainBWithLigandAndResidueLys12.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    logger.debug('_1neyChainBWithLigandAndResidueLys12.build');

    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        _1neyChainBWithLigandAndResidues.addStyleControls(adminDivId, swapViewer);
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    if (typeof(pdbUrl) == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/1ney_cleanedHETATM_justChainB.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('_1neyChainBWithLigandAndResidueLys12.build retrieved pdbData:  ' +
            pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb", {keepH:true});

        swapViewer.setStyle({}, {stick:defaults.hiddenStyle});
        _1neyChainBWithLigandAndResidues.drawSurface(swapViewer);

        swapViewer.setStyle({resn:"13P"}, {stick:defaults.stickStyle});

        var residueIndexes = data['resi'];
        swapViewer.setStyle({resi:residueIndexes}, {stick:defaults.stickStyle});

        swapViewer.addResLabels({resi:residueIndexes}, defaults.residueLabelStyle);

        biochemStyling.addHBonds(swapViewer, data['hBondPairs']);

        swapViewer.setView([-56.8,-43.8,-18.8,84.15,-0.12179,0.9859,0.009899,-0.116]);
        swapViewer.render();
    }});
};
