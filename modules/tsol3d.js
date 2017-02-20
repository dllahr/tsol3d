//import $ from 'jquery';
/*import defaults from './defaults';
import buildUtils from './buildUtils';
import biochemStyling from './biochemStyling';
import admin from './admin';*/
import tim6merFragmentA73I78 from './tim6merFragmentA73I78';


var logger = log4javascript.getLogger("tsol3dmolLogger");
logger.setLevel(log4javascript.Level.DEBUG);
var appender = new log4javascript.BrowserConsoleAppender();
var layout = new log4javascript.PatternLayout('%-5p %d{HH:mm:ss} - %m{1}%n');
appender.setLayout(layout);
logger.addAppender(appender);
logger.debug("log4javascript is working");


export function helloWorld() {
    var message = 'test that $tsol3d has loaded correctly and a function can be called:  hello world!';
    console.log(message);
    logger.debug(message);
/*    console.log('defaults.stickStyle:  ' + JSON.stringify(defaults.stickStyle));
    console.log('defaults.residueLabelStyle:  ' + JSON.stringify(defaults.residueLabelStyle));

    console.log('defaults.hiddenStyle:  ' + JSON.stringify(defaults.hiddenStyle));

    console.log('buildUtils.buttonHtml("hell world"):  ' + buildUtils.buttonHtml('hell world'));*/
};


export const export_tim6merFragmentA73I78 = tim6merFragmentA73I78;
