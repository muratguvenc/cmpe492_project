﻿/// <reference path="../../../Scripts/AjaxLogin.js" />
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


var paper, drawings;


function initRaphael () {
    //paper = Raphael($(".raphael")[0], 406, 664);
    paper = Raphael(0, 0, 600, 400);    
}

function drawCircle(x,y,r) {
    // Creates circle at x = 50, y = 40, with radius 10
    var circle = paper.circle(x, y, r);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");
}

function drawScaler() {
	var scaler = paper.path("M 400 40 l 0 15 l 0 -5 l 50 0 l 0 5 l 0 -15 l 0 10 l 50 0 l 0 -10 l 0 10 l 50 0 l 0 -10 z");
	var inScaler = paper.path("M 450 40 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 ");
	var text1 = paper.text(425, 58, '1 cm').attr({"font-size": 11,"font-weight": "bold"});
	var text2 = paper.text(560, 45, 'µm').attr({"font-size": 11,"font-weight": "bold"});
	var text3;
	for (var i = 0; i<4; i+=1){
		paper.text(400+i*50, 30, i*100).attr({"font-size": 11,"font-weight": "bold"});
	}
}

function clearPaper() {
    paper.clear();
}

window.onload = function () {
    initRaphael();
};