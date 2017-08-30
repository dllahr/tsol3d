import defaults from './defaults';
import buildUtils from './buildUtils';


export default function alpha_D_glucose() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


//basic build function is how the rendering is done
alpha_D_glucose.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
//  defaults.elementColors['N'] = 0xced676;
//  defaults.elementColors['O'] = 0xced676;
//  defaults.elementColors['S'] = 0xced676;
//  defaults.elementColors['P'] = 0xced676;
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;

    //provide a default URL to the pdb file if one is not provided
    if (typeof pdbUrl == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/4poc_A73-I78.pdb';
    }

    //load the pdb data, and when finished render it
    $.ajax({url: pdbUrl, success: function(data) {
        logger.trace('alpha_D_glucose.build retrieved pdb data:  ' + data.substring(0,100));

        swapViewer.addModel(data, "pdb");

        //the first argument indicates the selection criteria for atoms to be styled
        //the second argument indicates the styling
        //in this case it is selecting everything (empty dictionary) and applying the
        //default stick style, as it is definied in defaults (imported above)

        swapViewer.setView([-0.2424,0.429,-0.0431,130.2482,0.1371,-0.1608,0.194,0.958]);

        //swapViewer.setStyle({resn:['ADP','F6P'],invert:true}, {sphere:{color:0xced676}});
        //swapViewer.setStyle({resn:['ADP','F6P'],byres:true,expand:5},{sphere:{color:0xfffcbc}})
        swapViewer.setStyle({},{stick:defaults.stickStyle})

        swapViewer.render();
    }});
};
