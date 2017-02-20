
export default function buildUtils() {};


buildUtils.buttonHtml = function(value) {
    return '<input type="submit" value="' + value + '" class="btn btn-xs btn-default" />'
};


buildUtils.initialSetup = function(viewerDivId, adminDivId) {
    var swapViewer = $3Dmol.createViewer(viewerDivId);

    var usingAdmin = (typeof adminDivId != 'undefined') && (adminDivId != null);

    return {"swapViewer":swapViewer, "usingAdmin":usingAdmin};
};


buildUtils.basicButtonSetup = function(buttonValues, buttonsDivId) {
    var buttons = [];

    var buttonsDiv = $('#' + buttonsDivId);
    for (var i = 0; i < buttonValues.length; i++) {
        var bv = buttonValues[i];

        var buttonHtml = buildUtils.buttonHtml(bv);
        buttonsDiv.append(buttonHtml);

        var b = buttonsDiv.children('input[value="' + bv + '"]');
        buttons.push(b);
    }

    return buttons;
};
