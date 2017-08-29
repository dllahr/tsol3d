import defaults from './defaults';
import buildUtils from './buildUtils';


export default function PFK() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


//basic build function is how the rendering is done
PFK.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
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
        logger.trace('PFK.build retrieved pdb data:  ' + data.substring(0,100));

        swapViewer.addModel(data, "pdb");

        //the first argument indicates the selection criteria for atoms to be styled
        //the second argument indicates the styling
        //in this case it is selecting everything (empty dictionary) and applying the
        //default stick style, as it is definied in defaults (imported above)

        swapViewer.setView([27.7501,-202.6822,-175.3222,-144.7486,0.1204,-0.0615,0.5768,0.8057]);

        //swapViewer.setStyle({resn:['ADP','F6P'],invert:true}, {sphere:{color:0xced676}});
        //swapViewer.setStyle({resn:['ADP','F6P'],byres:true,expand:5},{sphere:{color:0xfffcbc}})
        swapViewer.setStyle({resn:['ADP','F6P'],byres:true},{sphere:defaults.stickStyle})
        swapViewer.addSurface("MS", {opacity:1.0, color:0xced676}, {resn:['ADP','F6P'],byres:true,expand:5,invert:true});
        swapViewer.addSurface("MS", {opacity:1.0, color:0xfffcbc}, {resi:[32,33,34,64,96,97,98,99,101,102,126,127,128,129,130,132,133,136,172,173,174,175,177,217,218,219,273,307,310],byres:true});
        swapViewer.render();
    }});
};
