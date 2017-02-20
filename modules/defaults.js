
export default function defaults() {};

defaults.elementColors = $.extend({
    'C': '0xC8C8C8',
    'N': '0x0070ff',
    'O': '0xF00000',
    'S': '0xFFC832'
}, $3Dmol.elementColors.defaultColors);

defaults.stickStyle = {singleBonds:true, colorscheme:defaults.elementColors};

defaults.hiddenStyle = {hidden:true, colorscheme:defaults.elementColors};

defaults.cartoonStyle = {style:'oval', outline:true, arrow:true};
defaults.cartoonOpacity = 0.8;

defaults.residueLabelStyle = {font:"Helvetica", fontSize:18, fontColor:"black",
    showBackground:false};

defaults.hydrophobicityColors = {hydrophobic:'0x217794', polar:'0x8acbd8', charged:'0xe1fbff'};
defaults.residueHydrophobicity = {
    hydrophobic:['Ala','Phe','Ile','Leu','Met','Val','Trp','Tyr','Cys','Pro'],
    polar:['Asn','Gln','Ser','Thr','Gly'],
    charged:['His','Lys','Arg','Asp','Glu']
};
