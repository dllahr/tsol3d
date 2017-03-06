import tim6merFragmentA73I78 from './tim6merFragmentA73I78';
import timFragmentAlphaHelixQ19N29 from './timFragmentAlphaHelixQ19N29';
import timFragmentParallelBetaSheetF6A42 from './timFragmentParallelBetaSheetF6A42';
import timLoopQ64I78 from './timLoopQ64I78';
import tertiaryStructureMonomer from './tertiaryStructureMonomer';
import timTertiaryStructureDimer from './timTertiaryStructureDimer';
import timThermalMotion from './timThermalMotion';
import _1neyChainBWithLigand from './1neyChainBWithLigand';
import _1neyChainBWithLigandAndResidues from './1neyChainBWithLigandAndResidues';
import _1neyChainBWithLigandAndResidueLys12 from './1neyChainBWithLigandAndResidueLys12';
import _1nf0ActiveSiteLoopMovement from './1nf0ActiveSiteLoopMovement';
import simpleEnantiomers from './simpleEnantiomers';
import dnaAlphaHelixOligo from './dnaAlphaHelixOligo';


var logger = log4javascript.getLogger("tsol3dmolLogger");
logger.setLevel(log4javascript.Level.DEBUG);
var appender = new log4javascript.BrowserConsoleAppender();
var layout = new log4javascript.PatternLayout('%-5p %d{HH:mm:ss} - %m{1}%n');
appender.setLayout(layout);
logger.addAppender(appender);
logger.debug("log4javascript is working.  tsol3d v2.1");


export function helloWorld() {
    var message = 'test that $tsol3d has loaded correctly and a function can be called:  hello world!';
    console.log(message);
    logger.debug(message);
};


export const export_tim6merFragmentA73I78 = tim6merFragmentA73I78;

export const export_timFragmentAlphaHelixQ19N29 = timFragmentAlphaHelixQ19N29;

export const export_timFragmentParallelBetaSheetF6A42 = timFragmentParallelBetaSheetF6A42;

export const export_timLoopQ64I78 = timLoopQ64I78;

export const export_tertiaryStructureMonomer = tertiaryStructureMonomer;

export const export_timTertiaryStructureDimer = timTertiaryStructureDimer;

export const export_timThermalMotion = timThermalMotion;

export const export__1neyChainBWithLigand = _1neyChainBWithLigand;

export const export__1neyChainBWithLigandAndResidues = _1neyChainBWithLigandAndResidues;

export const export__1neyChainBWithLigandAndResidueLys12 = _1neyChainBWithLigandAndResidueLys12;

export const export__1nf0ActiveSiteLoopMovement = _1nf0ActiveSiteLoopMovement;

export const export_simpleEnantiomers = simpleEnantiomers;

export const export_dnaAlphaHelixOligo = dnaAlphaHelixOligo;

/*******************************************
 * Caller function & map
 *******************************************/
const builderMap = {
    TIM_6mer_fragment_A73_I78: tim6merFragmentA73I78.build,

    TIM_fragment_alpha_helix_Q19_N29: timFragmentAlphaHelixQ19N29.build,

    TIM_fragment_parallel_beta_sheet_F6_A42: timFragmentParallelBetaSheetF6A42.build,

    TIM_loop_Q64_I78: timLoopQ64I78.build,

    TIM_tertiary_structure_monomer: tertiaryStructureMonomer.build,

    TIM_tertiary_structure_dimer: timTertiaryStructureDimer.build,

    TIM_thermal_motion: timThermalMotion.build,

    _1NEY_chain_B_with_ligand: _1neyChainBWithLigand.build,

    _1NEY_chain_B_with_ligand_and_residues: _1neyChainBWithLigandAndResidues.build,

    _1NEY_chain_B_with_ligand_and_residue_Lys12: _1neyChainBWithLigandAndResidueLys12.build,

    _1NF0_active_site_loop_movement: _1nf0ActiveSiteLoopMovement.build,

    simple_stereoisomers: simpleEnantiomers.build,

    DNA_Alpha_Helix_Oligo: dnaAlphaHelixOligo.build,
};


export function callTsol3d(fragmentName, viewerName, adminFlag) {
    var buildFunction = builderMap[fragmentName];
    var viewerDivId = viewerName + 'Div';
    var viewerButtonsDivId = viewerName + 'ButtonsDiv';

    var adminDivId = null;
    if ("admin" == adminFlag) {
        adminDivId = viewerName + 'AdminDiv';
    }

    buildFunction(viewerDivId, viewerButtonsDivId, adminDivId);
};
