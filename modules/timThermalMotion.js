import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';


export default function timThermalMotion() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


timThermalMotion.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_mixed_case.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('$timThermalMotion.build retrieved pdbData:  ' + pdbData.substring(0,100));

        swapViewer.addModel(pdbData, "pdb");

        var model = swapViewer.getModel();
        var atoms = model.selectedAtoms({});
        for (var i = 0; i < atoms.length; i++) {
            var atom = atoms[i];
            atom["dx"] = 2*Math.random() - 1.0;
            atom["dy"] = 2*Math.random() - 1.0;
            atom["dz"] = 2*Math.random() - 1.0;

        }
        model.vibrate(10, 0.5);
        swapViewer.animate({loop: "backAndForth"});

        swapViewer.setBackgroundColor(0xffffff);
        swapViewer.setStyle({}, {stick:defaults.stickStyle});

        swapViewer.setView([-16.0,1.62,-23.1,-76.0,0.5599,0.5069,-0.0074114,0.6553]);
        swapViewer.render();
    }});
};
