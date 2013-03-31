/// <reference path="../../../Scripts/AjaxLogin.js" />
/// <reference path="../../../Scripts/underscore.min.js" />
/// <reference path="../../../Scripts/angular-mocks-0.9.19.js" />
/// <reference path="../../../Scripts/angular.1.09.js" />
/// <reference path="../../../Scripts/angular.resource.js" />
/// <reference path="../../../Scripts/jquery-1.6.2-vsdoc.js" />
/// <reference path="../../../Scripts/jquery-1.6.2.js" />
/// <reference path="../../../Scripts/jquery-1.6.2.min.js" />
/// <reference path="../../../Scripts/jquery-ui-1.8.11.js" />
/// <reference path="../../../Scripts/jquery-ui-1.8.11.min.js" />
/// <reference path="../../../Scripts/jquery.unobtrusive-ajax.js" />
/// <reference path="../../../Scripts/jquery.unobtrusive-ajax.min.js" />
/// <reference path="../../../Scripts/raphael-min.js" />
/// <reference path="../../../Scripts/jquery.validate-vsdoc.js" />
/// <reference path="../../../Scripts/jquery.validate.js" />
/// <reference path="../../../Scripts/jquery.validate.min.js" />
/// <reference path="../../../Scripts/jquery.validate.unobtrusive.js" />
/// <reference path="../../../Scripts/jquery.validate.unobtrusive.min.js" />
/// <reference path="../../../Scripts/knockout-2.0.0.debug.js" />
/// <reference path="../../../Scripts/knockout-2.0.0.js" />
/// <reference path="../../../Scripts/less-1.3.0.min.js" />
/// <reference path="../../../Scripts/modernizr-2.0.6-development-only.js" />
/// <reference path="../../../Scripts/raphael-min.js" />

/*function cLog(args) {
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}*/


var paper,coverPaper ,drawings;


function initRaphael () {
    //paper = Raphael($(".raphael")[0], 406, 664);
    paper = Raphael(0, 0, 600, 400);    
}

function initCover (){
	coverPaper = Raphael(0, 0, 600, 400); 
}

function drawCircle(x,y,r) {
    var circle = paper.circle(x, y, r);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");
}

function drawCellCircle(x,y,r) {
	var circle = coverPaper.circle(x, y, r);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");
}

function drawScaler(multiple) {
	coverPaper.path("M 450 40 l 0 15 l 0 -5 l 32 0 l 0 5 l 0 -15 l 0 10 l 32 0 l 0 -10 l 0 10 l 32 0 l 0 -10 z");
	coverPaper.path("M 482 40 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0");
	coverPaper.text(466, 58, '1 cm').attr({"font-size": 11,"font-weight": "bold"});
	coverPaper.text(560, 45, 'µm').attr({"font-size": 11,"font-weight": "bold"});
	for (var i = 0; i<4; i+=1){
		coverPaper.text(450+i*32, 30, Math.round(i*32/multiple*10)/10).attr({"font-size": 11,"font-weight": "bold"});
	}
}

function clearPaper() {
    paper.clear();
}

function clearCover() {
	coverPaper.clear();
}

window.onload = function () {
    initRaphael();
};