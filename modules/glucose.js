import defaults from './defaults';
import buildUtils from './buildUtils';


export default function glucose() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


//basic build function is how the rendering is done
glucose.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;

    //provide a default URL to the pdb file if one is not provided
    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_A73-I78.pdb';
    }

    //load the pdb data, and when finished render it
    $.ajax({url: pdbUrl, success: function(data) {
        logger.trace('glucose.build retrieved pdb data:  ' + data.substring(0,100));

        swapViewer.addModel(data, "pdb");

        //the first argument indicates the selection criteria for atoms to be styled
        //the second argument indicates the styling
        //in this case it is selecting everything (empty dictionary) and applying the
        //default stick style, as it is definied in defaults (imported above)
        swapViewer.setStyle({}, {stick:defaults.stickStyle});

        swapViewer.render();
    }});
};
