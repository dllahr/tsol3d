import buildUtils from './buildUtils';


export default function admin() {};

var logger = log4javascript.getLogger("tsol3dmolLogger");


admin.commonAdminSetup = function(adminDivId, viewerDivId, swapViewer) {
    logger.debug('$admin.commonAdminSetup adminDivId:  ' + adminDivId + '  viewerDivId:  ' + viewerDivId +
        '  swapViewer:  ' + JSON.stringify(swapViewer));

    var adminDiv = $('#' + adminDivId);
    adminDiv.append('get things:');

    var captureButtonHtml = buildUtils.buttonHtml('get image');
    adminDiv.append(captureButtonHtml);

    var getViewCoordinatesButtonHtml = buildUtils.buttonHtml('get view coordinates');
    adminDiv.append(getViewCoordinatesButtonHtml);

    adminDiv.append('<div id="viewCoordinatesDiv"></div>');
    var viewCoordinatesDiv = $('#' + adminDivId).children('#viewCoordinatesDiv');

    adminDiv.append('<div id="staticImageDiv"></div>');
    var staticImageDiv = $('#' + adminDivId).children('#staticImageDiv');

    var canvases = $('#' + viewerDivId).children('canvas');
    var canvas = canvases[canvases.length - 1];
    var captureButton = adminDiv.children('input[value="get image"]');
    var cbData = {'_3dmolCanvas':canvas, 'staticImageDiv':staticImageDiv};
    captureButton.click(cbData, admin.getImage);

    var getViewCoordinatesButton = adminDiv.children('input[value="get view coordinates"]');
    var gvcData = {'swapViewer':swapViewer, 'viewCoordinatesDiv':viewCoordinatesDiv};
    getViewCoordinatesButton.click(gvcData, admin.getViewCoordinates);
};


const getImage = function(event) {
    var _3dmolCanvas = event.data._3dmolCanvas;
    var staticImageDiv = event.data.staticImageDiv;
    logger.debug('admin.getImage _3dmolCanvas:  ' + JSON.stringify(_3dmolCanvas) + '  staticImageDiv:  ' + JSON.stringify(staticImageDiv));

    var img = _3dmolCanvas.toDataURL("image/png");
        staticImageDiv.html('<img src="' + img + '"  />');
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
