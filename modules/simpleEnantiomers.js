import admin from './admin';
import defaults from './defaults';


export default function simpleEnantiomers() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");

const data = {xyz:'5\n' +
    '* (null), Energy   -1000.0000000\n' +
    'C     0.000000    0.000000    0.000000\n' +
    'H     0.931955   -0.364989    0.000000\n' +
    'F    -0.465975   -0.364992    0.807088\n' + //shows up as green in default 3DMol coloring scheme
    'Cl   -0.465975   -0.364992   -0.807088\n' + //shows up as brown in default 3DMol coloring scheme
    'I     0.000000    1.000000    0.000000'     //shows up as purple in default 3DMol coloring sheme
};

const elemLabelMap = {'I':'W', 'Cl':'Y', 'F':'Z', 'H':'X'};

const elemColorMap = {'H': '#ff00ff'};


simpleEnantiomers.build = function(viewerDivId, buttonsDivId, adminDivId) {
    logger.debug('simpleEnantiomers.build');

    var usingAdmin = (typeof(adminDivId) != 'undefined') && (adminDivId != null);

    var indivPrefixes = {left:{label:'(S)'}, right:{label:'(R)'}};
    logger.debug('simpleEnantiomers.build indivPrefixes:  ' + JSON.stringify(indivPrefixes));

    var viewerDiv = $('#' + viewerDivId);

    for (var ivp in indivPrefixes) {
        var indivViewerDivId = ivp + 'InnerViewer' + viewerDivId;
        logger.debug('simpleEnantiomers.build indivViewerDivId:  ' + indivViewerDivId);

        indivPrefixes[ivp]['indivViewerDivId'] = indivViewerDivId;

        viewerDiv.append('<div id="' + indivViewerDivId +
            '" style="height:300px; width:300px; float:left; position:relative"></div>');

        var indivSwapViewer = $3Dmol.createViewer(indivViewerDivId);
        indivPrefixes[ivp]['swapViewer'] = indivSwapViewer;

        if (usingAdmin) {
            var indivAdminDivId = ivp + 'InnerAdmin' + adminDivId;
            indivPrefixes[ivp]['indivAdminDivId'] = indivAdminDivId;

            $('#' + adminDivId).append('<div id="' + indivAdminDivId +
                '" style="height:100%; width:50%; float: left"></div>');

            admin.commonAdminSetup(indivAdminDivId, indivViewerDivId, indivSwapViewer);
        }
    }

    var assertOne = function(name, array) {
        if (array.length != 1) {
            throw 'expected to find one and only one atom of ' + name + ', found array.length:  ' +
                array.length;
        }
    };

    for (var ivp in indivPrefixes) {
        var swapViewer = indivPrefixes[ivp]['swapViewer'];

        var xyzData = data['xyz'];
        logger.trace('simpleEnantiomers.build :  ' + xyzData);

        var model = swapViewer.addModel(xyzData, 'xyz');
        var atoms = model.selectedAtoms({});

        //swap atoms to make enantiomer if the first one
        if ('left' == ivp) {
            var fluorine = atoms.filter(function(a) {return a.elem == 'F';});
            assertOne('fluorine', fluorine);
            fluorine = fluorine[0];

            var chlorine = atoms.filter(function(a) {return a.elem == 'Cl';});
            assertOne('chlorine', chlorine);
            chlorine = chlorine[0];

            fluorine.atom = 'Cl';
            fluorine.elem = 'Cl';
            chlorine.atom = 'F';
            chlorine.elem = 'F';
        }

        //delete the extra bonds
        var carbon = atoms.filter(function(a) {return a.elem == 'C';});
        assertOne('carbon', carbon);
        carbon = carbon[0];
        const carbonInd = atoms.indexOf(carbon);

        for (var i = 0; i < atoms.length; i++) {
            if (i != carbonInd) {
                var atom = atoms[i];
                atom.bonds = atom.bonds.filter(function(atomInd) {return carbonInd == atomInd;});
            }
        }

        //add atom labels
        const labelPositionScale = 1.45;
        var nonCAtoms = atoms.filter(function(a) {return a.elem != 'C';});
        for (var i = 0; i < nonCAtoms.length; i++) {
            var atom = nonCAtoms[i];
            var label = elemLabelMap[atom.elem];

            var labelData = $.extend({
                'position':{},
                alignment: 'center'
                }, defaults.residueLabelStyle);

            labelData['position']['x'] = labelPositionScale * atom.x;
            labelData['position']['y'] = labelPositionScale * atom.y;
            labelData['position']['z'] = labelPositionScale * atom.z;
            swapViewer.addLabel(label, labelData);
        }

        swapViewer.setStyle({}, {stick:defaults.stickStyle});
        for (var elem in elemColorMap) {
            const adjustedStyle = $.extend({'color':elemColorMap[elem]},
                defaults.stickStyle);
            delete adjustedStyle.colorscheme;

            swapViewer.setStyle({atom:elem}, {stick:adjustedStyle});
        }

        if ('left' == ivp) {
            swapViewer.setView([0,0.019,0,135.8,0.2138,0.2465,0.0572,0.9435])
        } else {
            swapViewer.setView([0,0.019,0,135.8,0.0641,0.9472,0.2137,0.2302]);
        }

        swapViewer.render();
    }
};
