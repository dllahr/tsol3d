import buildUtils from './buildUtils';
import admin from './admin';
import defaults from './defaults';


export default function _1nf0ActiveSiteLoopMovement() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


_1nf0ActiveSiteLoopMovement.build = function(viewerDivId, buttonsDivId, adminDivId, pdbUrl) {
    logger.debug('_1nf0ActiveSiteLoopMovement.build');
    var initialSetup = buildUtils.initialSetup(viewerDivId, adminDivId);
    var swapViewer = initialSetup.swapViewer;
    var usingAdmin = initialSetup.usingAdmin;

    if (usingAdmin) {
        admin.commonAdminSetup(adminDivId, viewerDivId, swapViewer);
    }

    if (typeof(pdbUrl) == 'undefined' || pdbUrl == null) {
        pdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/1nf0_cleanedHETATM_justChainA.pdb';
    }

    $.ajax({url: pdbUrl, success: function(pdbData) {
        logger.trace('_1nf0ActiveSiteLoopMovement.build retrieved pdbData:  ' + pdbData.substring(0,100));

        var model = swapViewer.addModel(pdbData, "pdb", {keepH:true, altLoc:'*'});

        swapViewer.setBackgroundColor(0xffffff);
            swapViewer.addSurface($3Dmol.SurfaceType.VDW, {opacity:0.8, color:'0x33a4e6'}, {altLoc:' '});
        swapViewer.setStyle({}, {stick:defaults.hiddenStyle});
        swapViewer.setStyle({altLoc:'A'}, {stick:defaults.stickStyle});
        swapViewer.setStyle({resi:[209,210,211,212]}, {stick:defaults.hiddenStyle});

        var allAtoms = model.selectedAtoms({});

        var startAtoms = model.selectedAtoms({altLoc:'A'});
        logger.debug('_1nf0ActiveSiteLoopMovement.build startAtoms[0]:');
        logger.debug(startAtoms[0]);

        var endAtoms = model.selectedAtoms({altLoc:'B'});

        var numFrames = 10;
        var gradient = {};
        var startAtomsMap = {};
        for (var i = 0; i < startAtoms.length; i++) {
            var sa = startAtoms[i];
            startAtomsMap[sa.serial] = sa;

            var ea = endAtoms[i];

            var g = {};
            g['dx'] = (ea.x - sa.x) / numFrames;
            g['dy'] = (ea.y - sa.y) / numFrames;
            g['dz'] = (ea.z - sa.z) / numFrames;

            gradient[sa.serial] = g;
        }
        logger.debug('_1nf0ActiveSiteLoopMovement.build gradient:  ' + JSON.stringify(gradient));

        const numPauseFrames = 4;
        //add initial pause frames
        for (var f = 1; f <= numPauseFrames; f++) {
            var frame = [];

            for (var i = 0; i < allAtoms.length; i++) {
                var atom = allAtoms[i];

                var newAtom = {};
                for (var k in atom) {
                    newAtom[k] = atom[k];
                }
                frame.push(newAtom);
            }
            model.addFrame(frame);
        }

        for (var f = 1; f <= numFrames; f++) {
            var frame = [];

            for (var i = 0; i < allAtoms.length; i++) {
                var atom = allAtoms[i];

                var newAtom = {};
                for (var k in atom) {
                    newAtom[k] = atom[k];
                }
                frame.push(newAtom);

                if (atom.serial in startAtomsMap) {
                    var sa = startAtomsMap[atom.serial];
                    var g = gradient[atom.serial];

                    newAtom.x = sa.x + f*g.dx;
                    newAtom.y = sa.y + f*g.dy;
                    newAtom.z = sa.z + f*g.dz;
                }
            }
            model.addFrame(frame);
        }

        //add final pause frames
        for (var f = 1; f <= numPauseFrames; f++) {
            var frame = [];

            for (var i = 0; i < allAtoms.length; i++) {
                var atom = allAtoms[i];

                var newAtom = {};
                for (var k in atom) {
                    newAtom[k] = atom[k];
                }
                frame.push(newAtom);

                if (atom.serial in startAtomsMap) {
                    var sa = startAtomsMap[atom.serial];
                    var g = gradient[atom.serial];

                    newAtom.x = sa.x + numFrames*g.dx;
                    newAtom.y = sa.y + numFrames*g.dy;
                    newAtom.z = sa.z + numFrames*g.dz;
                }
            }
            model.addFrame(frame);
        }

        swapViewer.setView([-23.46,-10.79,-144.9,-8.1027,-0.1585,0.3274,0,-0.9314]);
        swapViewer.render();
        swapViewer.animate({loop:'back and forth'});
    }});
};
