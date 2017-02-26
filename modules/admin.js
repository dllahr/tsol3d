import buildUtils from './buildUtils';


export default function admin() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


admin.commonAdminSetup = function(adminDivId, viewerDivId, swapViewer) {
    logger.debug('$admin.commonAdminSetup adminDivId:  ' + adminDivId + '  viewerDivId:  ' + viewerDivId +
        '  swapViewer:  ' + JSON.stringify(swapViewer));

    var adminDiv = $('#' + adminDivId);

    var getViewCoordinatesButtonHtml = buildUtils.buttonHtml('get view coordinates');
    adminDiv.append(getViewCoordinatesButtonHtml);
    adminDiv.append('<div id="viewCoordinatesDiv"></div>');
    var viewCoordinatesDiv = $('#' + adminDivId).children('#viewCoordinatesDiv');

    adminDiv.append('image size  w:<input type="text" id="imageWidthInput" value="1200" size="5"/>');
    var imageWidthInput = adminDiv.children('#imageWidthInput');
    adminDiv.append('  h:<input type="text" id="imageHeightInput" value="1200" size="5"/>');
    var imageHeightInput = adminDiv.children('#imageHeightInput');
    adminDiv.append('  crop from right:<input type="text" id="imageCropRightInput" value="0" size="5"/>');
    var imageCropRightInput = adminDiv.children('#imageCropRightInput');
    adminDiv.append('  crop from bottom:<input type="text" id="imageCropBottomInput" value="0" size="5"/>')
    var imageCropBottomInput = adminDiv.children('#imageCropBottomInput');
    var captureButtonHtml = buildUtils.buttonHtml('get image');
    adminDiv.append(captureButtonHtml);



    adminDiv.append('<div id="staticImageDiv" style="border:1px solid black; max-width:601"><canvas id="staticImageCanvas" /></div>');
    var staticImageDiv = adminDiv.children('#staticImageDiv');
    var staticImageCanvas = staticImageDiv.children('#staticImageCanvas')[0];
    adminDiv.append('<br/>');

    var canvases = $('#' + viewerDivId).children('canvas');
    var canvas = canvases[canvases.length - 1];
    var captureButton = adminDiv.children('input[value="get image"]');
    var cbData = {
        '_3dmolCanvas': canvas,
        'staticImageDiv': staticImageDiv,
        'staticImageCanvas': staticImageCanvas,
        'imageWidthInput': imageWidthInput,
        'imageHeightInput': imageHeightInput,
        'imageCropRightInput': imageCropRightInput,
        'imageCropBottomInput': imageCropBottomInput
    };
    captureButton.click(cbData, getImage);

    var getViewCoordinatesButton = adminDiv.children('input[value="get view coordinates"]');
    var gvcData = {
        'swapViewer': swapViewer,
        'viewCoordinatesDiv': viewCoordinatesDiv,
    };
    getViewCoordinatesButton.click(gvcData, getViewCoordinates);
};


const getImage = function(event) {
    var _3dmolCanvas = event.data._3dmolCanvas;
    var staticImageCanvas = event.data.staticImageCanvas;
    logger.debug('admin.getImage _3dmolCanvas:  ' + JSON.stringify(_3dmolCanvas)
        + '  staticImageCanvas:  ' + JSON.stringify(staticImageCanvas));
    var staticImageDiv = event.data.staticImageDiv;

    var imageWidth = event.data.imageWidthInput.val();
    var imageHeight = event.data.imageHeightInput.val();
    var cropRight = event.data.imageCropRightInput.val();
    var cropBottom = event.data.imageCropBottomInput.val();
    logger.debug('imageWidth:  ' + imageWidth + '  imageHeight:  ' + imageHeight +
        '  cropRight:  ' + cropRight + '  cropBottom:  ' + cropBottom);

    var width = imageWidth - cropRight;
    var height = imageHeight - cropBottom;
    staticImageDiv.css('max-width', width+1);
    staticImageDiv.attr('height', height+1)
    staticImageCanvas.width = width;
    staticImageCanvas.height = height;
    staticImageCanvas.getContext('2d').drawImage(_3dmolCanvas, 0, 0, imageWidth, imageHeight);
};


const getViewCoordinates = function(event) {
    var swapViewer = event.data.swapViewer;
    var viewCoordinatesDiv = event.data.viewCoordinatesDiv;

    logger.debug('admin.getViewCoordinates swapViewer:  ' + JSON.stringify(swapViewer) + '  viewCoordinatesDivId:  ' + JSON.stringify(viewCoordinatesDiv));

    var viewCoords = swapViewer.getView();
    for (var i = 0; i < viewCoords.length; i++) {
        viewCoords[i] = Math.round(viewCoords[i] * 10000) / 10000;
    }

    viewCoordinatesDiv.html(JSON.stringify(viewCoords));
};
