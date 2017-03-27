import defaults from './defaults';
import buildUtils from './buildUtils';


export default function aminoAcids() {};

var logger = log4javascript.getLogger('tsol3dmolLogger');


aminoAcids.build = function(viewerDivId, basePdbUrl, baseImgUrl) {
    var initialSetup = buildUtils.initialSetup(viewerDivId);
    const swapViewer = initialSetup.swapViewer;

    if (typeof basePdbUrl == 'undefined' || basePdbUrl == null) {
        basePdbUrl = 'https://www.secretoflife.org/sites/default/files/pdb/amino_acids/';
    }
    if (typeof baseImgUrl == 'undefined' || null == baseImgUrl) {
        baseImgUrl = '/sites/default/files/pictures/biochemistry/protein_structure/';
    }

    var viewerDivHtml = "<div id='3DMolViewerDiv'></div><div style='text-align:right; 5px; marin-top:-20px; margin-right: 7px; font-size:12px;'>This structure is interactive. <a href='https://www.secretoflife.org/Interactive%20molecular%20structures' target='_blank'>Learn more.</a></div>";
    $(viewerDivId).html(viewerDivHtml);
    $('#3DMolViewerDiv').css({'width':275, 'height':220});

    for (var i = 0; i < aminoAcidList.length; i++) {
        var aaObj = aminoAcidList[i];
        logger.trace('tsol3d aminoAcids build aaObj:  ' + JSON.stringify(aaObj));

        var aaUrl = basePdbUrl + aaObj.aaName + '.pdb';

        $.ajax({url: aaUrl, 'swapViewer': swapViewer, 'aaObj': aaObj, 'baseImgUrl':baseImgUrl,
            success: function(aaPdbData) {
                var eventData = addEventToImg(this.swapViewer, this.aaObj, aaPdbData,
                    this.baseImgUrl);

                if ('alanine' == this.aaObj.aaName) {
                    swapView({'data':eventData});
                }
            }
        });
    }
};


const swapView = function(event) {
    logger.trace('tsol3d aminoAcids swapView');

    var swapViewer = event.data.swapViewer;
    var aaPdbData = event.data.aaPdbData;
    var defaultView = event.data.defaultView;
    var imgUrl = event.data.imgUrl;

    var imageElements = $(".large-image");
    imageElements.html('<img src="' + imgUrl + '" />');

    swapViewer.removeAllModels();
    swapViewer.addModel(aaPdbData, 'pdb');
    swapViewer.setStyle({}, {stick:defaults.stickStyle});

    swapViewer.setView(defaultView);
    swapViewer.render();
};


const addEventToImg = function(swapViewer, aaObj, aaPdbData, baseImgUrl) {
    var curDefaultView = defaultViews[aaObj.aaName];
    logger.trace('tsol3d aminoAcids addEventToImg curDefaultView:  ' + JSON.stringify(curDefaultView));

    var imgUrl = baseImgUrl + aaObj.abbr + '_lg.svg';
    logger.trace('tsol3d aminoAcids addEventToImg imageUrl:  ' + imgUrl);

    var eventData = {'swapViewer':swapViewer, 'aaPdbData':aaPdbData,
        'defaultView':curDefaultView, 'imgUrl':imgUrl};

    var img = $('#' + aaObj.abbr + 'Img');
    img.click(eventData, swapView);

    return eventData;
};

/*
function switch_images(COMNAME) {
 $(".large-image").html('<img src="/sites/default/files/pictures/biochemistry/protein_structure/'+COMNAME+'_lg.svg" />');
 $("#viewerDiv").css({"background-image":"url(/sites/default/files/pictures/biochemistry/protein_structure/"+COMNAME+"_3d.jpg)"});

 viewAa(COMNAME);
}
*/

const aminoAcidList = [
    {"abbr":"ala","aaName":"alanine"},
    {"abbr":"cys","aaName":"cysteine"},
    {"abbr":"asp","aaName":"aspartic-acid"},
    {"abbr":"glu","aaName":"glutamic-acid"},
    {"abbr":"phe","aaName":"phenylalanine"},
    {"abbr":"gly","aaName":"glycine"},
    {"abbr":"his","aaName":"histidine"},
    {"abbr":"ile","aaName":"isoleucine"},
    {"abbr":"lys","aaName":"lysine"},
    {"abbr":"leu","aaName":"leucine"},
    {"abbr":"met","aaName":"methionine"},
    {"abbr":"asn","aaName":"asparagine"},
    {"abbr":"pro","aaName":"proline"},
    {"abbr":"gln","aaName":"glutamine"},
    {"abbr":"arg","aaName":"arginine"},
    {"abbr":"ser","aaName":"serine"},
    {"abbr":"thr","aaName":"threonine"},
    {"abbr":"val","aaName":"valine"},
    {"abbr":"trp","aaName":"tryptophan"},
    {"abbr":"tyr","aaName":"tyrosine"}
];


var defaultViews = {    "alanine":[-0.0803333333333333,-0.012666666666666678,-0.007500000000000007,121.64359090191145,-0.25672099921234803,0.3469208302315211,-0.07093777594998553,-0.8992819902890058],
"arginine":[-0.00974999999999974,0.017916666666666636,0.002916666666666734,121.64359090191145,-0.2653406076574527,-0.24677274061834453,0.25975608224481866,0.8951113641064485],
"asparagine":
[-0.053222222222222185,0.02655555555555553,-0.004222222222222244,121.64359090191145,0.24965110407865904,0.057350897520130395,-0.3248129274831002,-0.9104294387407514],
"aspartic-acid":
[-0.03100000000000004,0.03388888888888897,-0.006666666666666648,121.64359090191145,0.24965110407865904,0.057350897520130395,-0.3248129274831002,-0.9104294387407514],
"cysteine":
[-0.1504285714285714,0.2514285714285714,-0.16971428571428573,121.64359090191145,0.2774866174524417,-0.3121821919562027,-0.8204977513861482,-0.3902907840706677],
"glutamine":
[-0.025300000000000055,0.03959999999999997,-0.0029999999999999623,121.64359090191145,-0.10687866877392622,0.23112799466505263,-0.2624982643861526,-0.9307263085555718],
"glutamic-acid":
[-0.027899999999999904,0.028099999999999993,0.00490000000000001,121.64359090191145,-0.1502575629605307,0.003586188637744198,-0.2320312368602602,-0.9610261750573258],
"glycine":
[-0.05499999999999996,0.0278,0.008400000000000008,121.64359090191145,-0.6406598799243651,-0.04725181337264707,0.3838322322557011,0.6633211905780628],
"histidine":
[0.002272727272727305,0.04881818181818183,-0.08927272727272734,121.64359090191145,0.5137667898925389,0.13662660874504015,0.2638831675119861,0.8048245332308065],
"isoleucine":
[-0.06911111111111112,-0.015333333333333322,0.00555555555555556,121.64359090191145,0.054697450077307155,-0.3422498668743734,0.20925330510039636,0.9143775324689868],
"leucine":
[-0.06977777777777769,-0.013000000000000086,0.0012222222222222356,121.64359090191145,0.7274019884418923,0.10710286215589421,0.24676989956896955,0.6312843581109192],
"lysine":
[-0.07929999999999993,-0.022299999999999896,-0.03109999999999997,121.64359090191145,0.1321434779013423,0.041974948180378904,0.3284256929097666,0.9342980087799234],
"methionine":
[-0.2352222222222221,-0.20533333333333337,-0.1593333333333333,121.64359090191145,0.4230912385735091,0.16796119340558258,-0.1620385673138815,-0.8755149022460837],
"phenylalanine":
[0.030666666666666714,-0.0658333333333334,-0.22624999999999992,121.64359090191145,-0.25893235022575245,-0.7405033175038513,-0.5951851468181814,-0.1742513006533296],
"proline":
[0.023999999999999994,-0.017375000000000057,0.03512499999999996,121.64359090191145,0.39795892550355577,0.8683830241484565,-0.22874053100392805,0.18766295974132877],
"serine":
[-0.07857142857142861,-0.030857142857142854,-0.015999999999999997,121.64359090191145,-0.18504215411078587,-0.043149011156184705,-0.28764279250707925,-0.9387007978887688],
"threonine":
[-0.08612499999999998,-0.023750000000000104,-0.0063750000000000195,121.64359090191145,-0.18504215411078587,-0.043149011156184705,-0.28764279250707925,-0.9387007978887688],
"tryptophan":
[0.09933333333333337,0.05120000000000003,-0.09806666666666689,121.64359090191145,0.0892852361827863,-0.29801902351277215,0.366290859404453,0.8769514322589498],
"tyrosine":
[0.0671538461538462,0.01946153846153849,0.046153846153846295,121.64359090191145,-0.13551089457383425,-0.7643751836255397,-0.6227961391697214,-0.09742866695438593],
"valine":
[-0.04074999999999998,-0.017624999999999974,-0.009624999999999995,121.64359090191145,0.17469971534429915,0.03547718941380063,0.09155595734873206,0.9797136750928169]
};
