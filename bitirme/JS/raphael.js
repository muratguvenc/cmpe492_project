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

var paper,coverPaper, clockPaper,recPaper,drawings;


$(document).ready(function(){
	initCover();
});

function initRaphael () {
    paper = Raphael(0, 0, 600, 400);  
}

function initCover (){
	clockPaper = Raphael(0, 0, 300, 300);
	coverPaper = Raphael(0, 0, 600, 400);
	recPaper = Raphael(0, 0, 600, 400);
	coverPaper.path("M 0 0 l 600 0 l 0 400 l -600 0 z").attr({"stroke-width" : "10"});
}

function drawCircle(x,y,r) {
    var circle = paper.circle(x, y, r);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#291761");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");
}

function drawCellCircle(x,y,r) {
	var circle = coverPaper.circle(x, y, r);
    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#6086C4");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");
}

function drawScaler(multiple) {
	coverPaper.path("M 450 40 l 0 15 l 0 -5 l 32 0 l 0 5 l 0 -15 l 0 10 l 32 0 l 0 -10 l 0 10 l 32 0 l 0 -10 z");
	coverPaper.path("M 482 40 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0 l -5 -10 l 5 10 l 5 0");
	coverPaper.text(466, 58, '1 cm').attr({"font-size": 11,"font-weight": "bold"});
	coverPaper.text(560, 45, 'µm').attr({"font-size": 11,"font-weight": "bold"});
	coverPaper.text(480, 365, '# Molecules Received : ').attr({"font-size": 12,"font-weight": "bold"});
	for (var i = 0; i<4; i+=1){
		coverPaper.text(450+i*32, 30, Math.round(i*32/multiple*10)/10).attr({"font-size": 11,"font-weight": "bold"});
	}
}
function drawClock(size, length) {
	clockPaper.clear();
	clockPaper.rect(40,25,150,20,2);
	clockPaper.path("M 40 35 l "+size+" 0").attr({"stroke" : "#6086C4","stroke-width" : "20" ,"opacity" : 0.01*size});
}

function drawOutput(size, length, place) {
	clockPaper.rect(40,55,150,20,2);
	var temp = 40+(place*(150/length));
	clockPaper.path("M "+temp+" 65 l "+size+" 0").attr({"stroke" : "#6086C4","stroke-width" : "20" ,"opacity" : 0.05*size});
}

function drawInputStream(stream){
	var streamArr = stream.split("");
	for(var i = 0 ; i<stream.length ; i++){
		coverPaper.text(40+(150/stream.length)*(i+(1/2)), 35, streamArr[i]).attr({"font-size": 12,"font-weight": "bold"});
		coverPaper.path("M 40 55 l "+((150/stream.length)*i)+" 0 l 0 20");
		coverPaper.path("M 40 25 l "+((150/stream.length)*i)+" 0 l 0 20");
	}
}

function drawFalse(place,streamLength, bit){
	coverPaper.rect(40+place*(150/streamLength), 55, (150/streamLength), 20, 2).attr({"fill" : "f00"});
	coverPaper.text(40+(150/streamLength)*(place+(1/2)), 65, bit).attr({"font-size": 12,"font-weight": "bold"});
}

function drawTrue(place,streamLength, bit){
	coverPaper.rect(40+place*(150/streamLength), 55, (150/streamLength), 20, 2).attr({"fill" : "0f0"});
	coverPaper.text(40+(150/streamLength)*(place+(1/2)), 65, bit).attr({"font-size": 12,"font-weight": "bold"});
}

function receiveCount(color){
	if(color == 1){
		coverPaper.path("M 550 350 l 30 0 l 0 30 l -30 0 z").attr({"fill" : "#00FF00"});
	}
	else if(color == 0){
		coverPaper.path("M 550 350 l 30 0 l 0 30 l -30 0 z").attr({"fill" : "#f00"});
	}
	else{
		coverPaper.path("M 550 350 l 30 0 l 0 30 l -30 0 z").attr({"fill" : "#6086C4"});
	}
}

function receiveMoleculeNumber(countMolecules){
	recPaper.text(565, 365, countMolecules).attr({"font-size": 12,"font-weight": "bold"});
}

function drawEmptyClock(output){
	coverPaper.path("M 40 "+(25+(30*output))+" l 150 0 l 0 20 l -150 0 z");
	if(output == 0){
		coverPaper.text(205, 35, 'sec').attr({"font-size": 12,"font-weight": "bold"});
	}
}

function showStatistics(totalTime, totalArrive, correctData, length){
	var a = new Array();
	a[0] = paper.path("M 240 -200 l 340 0 l 0 200 l -340 0 z").attr({"stroke" : "#563D0B", "fill" : "#FFF798","stroke-width" : "5"});
	a[1] = paper.text(260, -210, '\u2022 Total time in simulation :'+totalTime+' sec ').attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[2] = paper.text(260, -210, '\u2022 Total # molecules arrived to receiver : '+totalArrive).attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[3] = paper.text(260, -210, '\u2022 Avg. # molecules arrived to receiver in').attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[4] = paper.text(360, -210, 'a symbol time: '+(Math.round(totalArrive/length*100))/100).attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[5] = paper.text(260, -210, '\u2022 Success percentage of data ').attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[6] = paper.text(360, -210, 'transmission : '+(Math.round(correctData/length*100))/100).attr({"font-size": 14,"font-weight": "bold", "text-anchor":"start"});
	a[0].animate({path : "M 240 20 l 340 0 l 0 200 l -340 0 z"}, 800);
	for(var i=0;i<6;i++){
		if(i==3 || i==5){
			a[i+1].animate({x : 360 , y : 20+20*(i+1)}, 800);
		}
		else{
			a[i+1].animate({x : 260 , y : 20+20*(i+1)}, 800);
		}
	}

}

function clearPaper() {
    paper.clear();
}

function clearRecPaper() {
    recPaper.clear();
}

function clearCover() {
	coverPaper.clear();
}

function clearClockPaper() {
	clockPaper.clear();
}

window.onload = function () {
    initRaphael();
};