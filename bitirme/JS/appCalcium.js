/// <reference path="../../../Scripts/angular.1.09.js" />


function CalciumSignalingController($scope) {
	var SIZE_X = 600 , SIZE_Y = 400;
	var cellLength=250,cellWidth=200,X=50,Y=100;
	var	centerERX_cell1=175, centerERY_cell1=260, centerERX_cell2=425, centerERY_cell2=260, ER_rHor=110, ER_rVer=30;
	var nucX_cell1 = 90, nucY_cell1 = 120, nucX_cell2 = 340, nucY_cell2 = 120, nucWidth = 75, nucLength=130;
	var passageX_1 = 300, passageY_1 = 139, passageX_2 = 300, passageY_2 = 192, passageX_3 = 300, passageY_3=245, passageLength = 14;
	var centerReceptorX_cell1 = 265 , centerReceptorY_cell1 = 180, centerReceptorX_cell2 = 515 , centerReceptorY_cell2 = 180 ,receptorRadius = 20;
    var mean, stdDev, numberOfMolecules, numberOfMoleculesCal, initialX, initialY, distanceBetweenTwoCells, environmentMoleculeSize, boltzmanCoeff, 
		temperature, viscosity, moleculeSize, cellRadius, inputStream, moleculesIP3, moleculesCal, threshold, cellRadiusLocal, multiple, symbolDuration,
		lastValues = new Array(), statistics = new Array() ,color, totalArrive = 0, correctData = 0;
	
	var thresholdER = 40, thresholdReceptor = 15, thresholdPassage = 3;
	var countIP3_1 = 0, countIP3_2 = 0, countCal_1 = 0, countCal_2 = 0, countIP3_passed = 0;
	var localTime = 0;
	var refreshNow = 0, makeItGreen = 0;
	var ER_pushCheck_1 = 1, ER_pushCheck_2 = 1, inputReceivedTrue = 0;
    
	moleculesIP3 = [];
	moleculesCal = [];
	mean = 0;
	color = 2;
    numberOfMolecules = 100;
	numberOfMoleculesCal = 40;
    initialX = X+1;
    initialY = Y+1;
	distanceBetweenTwoCells = 7;	//mikrometre
	cellRadius = 15;
    environmentMoleculeSize = 1.32; //nanometer
    boltzmanCoeff = 0.000086173324;
    temperature = 310; //kelvin
    viscosity = 0.001; // ( kg / (s * m) )
    moleculeSize = 2.5;   //nanometer
	threshold = 30;
	symbolDuration = 60; //sec
	inputStream = "1101";
	outputStream = "";
	
    $scope.view = {
		symbolDuration: 60, //sec
        moleculesIP3: [],
		moleculesCal: [],
        iterationTime: 0.5,   //sec
        numberOfMolecules: 100,
		numberOfMoleculesCal: 40,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 7,
		cellRadius: 15,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 2.5,
		environmentMoleculeSize: 1.32,
		threshold: 30,
		thresholdER: 40, 
		thresholdReceptor: 15, 
		thresholdPassage: 3,
		inputStream: "1011",
		outputStream: "",
        show:true,
		notShow: false,
		showIterate: false,
    };

	/*
	It takes satandart deviation as a parameter and create a Gaussian Random number then return this number.
	*/
    function generateGaussianRandom(stdDev) {

        var u1, u2, randStdNormal;
        u1 = Math.random();
        u2 = Math.random();
        randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); //random normal(0,1);
        return (mean + stdDev * randStdNormal);
    }
	
	function locationOfCenter(radius,distance){
		multiple = Number((Number(SIZE_X)-100)/(4*radius + Number(distance)));
		return multiple;
	}

	/*
	This function calculates the distance that a molecule can go in one iteration time and return this number. 
	The original version of this formula that we used in this method is in the Energy Model for Communication 
	via Diffusion in Nanonetworks. Return value can change according to environment molecule size.
	*/
    function caculatePropagationStandardDeviation(time) {

        if (environmentMoleculeSize > moleculeSize + 0.1) {
            return Math.sqrt(((boltzmanCoeff * temperature)
                    / (3 * Math.PI * viscosity  * moleculeSize)) * time);
        }
        return Math.sqrt(((boltzmanCoeff * temperature)
                    / (2 * Math.PI * viscosity  * moleculeSize)) * time);
    }

	/*
	It  draw all calcium and IP3 molecules to screen.
	*/
    function drawAllMolecules() {
        var moleculesLocal, moleculesCalLocal;

        moleculesLocal = $scope.view.moleculesIP3;     //for performance increase
		moleculesCalLocal = $scope.view.moleculesCal;
		
        for (var i = 0; i < moleculesLocal.length; i++) {
            drawCircle(moleculesLocal[i].x, moleculesLocal[i].y, 1);
        }
		
		 for (var i = 0; i < moleculesCalLocal.length; i++) {
            drawCircle(moleculesCalLocal[i].x, moleculesCalLocal[i].y, 1.5);
        }
		
    };
	/*
	It takes x and y coordinate of a molecule and x and y coordinates of receptor’s center and receptor radius 
	as a parameter.  After that it calculates whether a given molecule is in the receptor or not. Return true 
	if molecule is in the receptor, false otherwise.
	*/
	function inReceptorCheck(moleculeX, moleculeY, receptorX, receptorY, recRadius){
		if(recRadius*recRadius >= ((moleculeX-receptorX)*(moleculeX-receptorX))+((moleculeY-receptorY)*(moleculeY-receptorY))){
			return true;
		}
		return false;
	}
	/*
	It takes x and y coordinate of a molecule’s next iteration and x and y coordinates of cell’s left up point 
	and cell’s length and width as a parameter.  After that it calculates whether a molecule will be in the 
	cell at next iteration or not. Return true if molecule is in the cell, false otherwise.
	*/
	function inCellCheck(dX, dY, sX, sY, sL, sW){
		if((dY>=sY) && (dX>=sX) && (dX<=sX+sL) && (dY<=sY+sW)){
			return true;
		}
		return false;
	
	}
	
	/*
	It takes x and y coordinate of a molecule’s current location(x1,y1) and x and y coordinate of a molecule’s
	next iteration(x2,y2), and x and y coordinates of passage’s starting point(x3,y3), x and y coordinates of 
	passage’s ending point(x4,y4) .  After that it calculates whether a molecule will pass through a passage 
	at next iteration or not. Return true if molecule pass through a given passage, false otherwise.
	*/
	function passCellCheck(x1,y1,x2,y2,x3,y3,x4,y4){
		var a,b,c,ix,iy;
		a = x1 * y4 - x2 * y4 - x1 * y2 - x4 * y1 + x4 * y2 + x2 * y1;
		b = x3 * y1 - x3 * y2 - x4 * y1 + x4 * y2 - x1 * y3 + x2 * y3 + x1 * y4 - x2 * y4;
		if (b == 0){
			return false;
		}
		c = a / b;
		
		if(c<0 || c>1)
			return false;

		if(Math.max(x1,x2)<Math.min(x3,x4) || Math.min(x1,x2)>Math.max(x3,x4) ||
			Math.max(y1,y2)<Math.min(y3,y4) || Math.min(y1,y2)>Math.max(y3,y4))
			return false;

		return true;
	}
	
	/*
	It takes x and y coordinate of a molecule’s next iteration(dx,dy) and x and y coordinate of ER’s center(cen_ERX, cen_ERY), 
	and vertical and horizontal radius of an ER(ER_rHor, ER_rVer. After that it calculates whether a molecule will be in 
	given ER at next iteration or not. Return true if molecule will be in ER, false otherwise.
	*/
	function inERCheck(dX,dY,cen_ERX,cen_ERY){
		var inER=((dX-cen_ERX)*(dX-cen_ERX))/((ER_rHor)*(ER_rHor))+((dY-cen_ERY)*(dY-cen_ERY))/((ER_rVer)*(ER_rVer));
		if(inER<=1){
			return true;
		}
		return false;
	}

	/*
	It is the main function that controls the IP3 and calcium molecules movement. Firstly for IP3 molecules 
	it check whether an IP3 molecules will go into an E. Reticulum or not. If it will enter ER then function 
	destroy this molecule(because it is absorbed by ER) and update the relevant IP3 counter. Then it checks 
	whether an IP3 molecules pass through the passage between cells or not. And if pass through passage 
	it updates the relevant IP3 counter. After that it checks whether an IP3 molecules will be in Cell 
	or not in next iteration. If molecule tries to exit from the cell, then this method doesn’t allow to 
	move this particular molecule for this iteration. Similarly  if molecule tries to enter the nucleus, 
	then this method doesn’t allow to move this particular molecule for this iteration.  For the calcium 
	molecules it does very similar things. The real difference is it calculates the number of calcium 
	molecules at the receptor areas and then update the relevant counter for this values.
	*/
    function iterateMolecules() {
        var stdDev, tempGaussX, tempGaussY;

        stdDev = caculatePropagationStandardDeviation($scope.view.iterationTime);

        moleculesIP3 = $scope.view.moleculesIP3;
		moleculesCal = $scope.view.moleculesCal;

        for (var i = 0; i < moleculesIP3.length; i++) {
			
			tempGaussX = generateGaussianRandom(stdDev)*multiple;
			tempGaussY = generateGaussianRandom(stdDev)*multiple;
			
			if(inERCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY , centerERX_cell1, centerERY_cell1) ){
				countIP3_1++;
				moleculesIP3.splice(i,1);
				totalArrive++;
				clearRec1Paper();
				receiveMoleculeNumber1(countIP3_1, 265, 365);
			}
			
			else if(inERCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY , centerERX_cell2, centerERY_cell2) ){
				countIP3_2++;
				moleculesIP3.splice(i,1);
				totalArrive++;
				clearRec2Paper();
				receiveMoleculeNumber2(countIP3_2, 515,365);
			}
			
			else if(moleculesIP3[i].x < X+cellLength){
				if(passCellCheck(moleculesIP3[i].x, moleculesIP3[i].y,(moleculesIP3[i].x+ +tempGaussX), (moleculesIP3[i].y + +tempGaussY), passageX_1, passageY_1, passageX_1, (passageY_1+ +passageLength))
					|| passCellCheck(moleculesIP3[i].x, moleculesIP3[i].y,(moleculesIP3[i].x+ +tempGaussX), (moleculesIP3[i].y + +tempGaussY), passageX_2, passageY_2, passageX_2, (passageY_2+ +passageLength))
					|| passCellCheck(moleculesIP3[i].x, moleculesIP3[i].y,(moleculesIP3[i].x+ +tempGaussX), (moleculesIP3[i].y + +tempGaussY), passageX_3, passageY_3, passageX_3, (passageY_3+ +passageLength))){
				moleculesIP3[i].x += tempGaussX;
				moleculesIP3[i].y += tempGaussY;
				countIP3_passed++;
			}
				else if(inCellCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY, X, Y, cellLength, cellWidth) && 
							!inCellCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY, nucX_cell1, nucY_cell1, nucLength, nucWidth)){
					moleculesIP3[i].x += tempGaussX;
					moleculesIP3[i].y += tempGaussY;
				}
				
			}
			else if(moleculesIP3[i].x >= X+cellLength){
				if(inCellCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY,X+cellLength,Y,cellLength, cellWidth) && 
							!inCellCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY, nucX_cell2, nucY_cell2, nucLength, nucWidth)){
					moleculesIP3[i].x += tempGaussX;
					moleculesIP3[i].y += tempGaussY;
				}
			}
			else{
				//no move for this molecule in this round
			}
            
        }
		for(var i = 0; i < moleculesCal.length; i++) {
			
			tempGaussX = generateGaussianRandom(stdDev)*multiple/3;
			tempGaussY = generateGaussianRandom(stdDev)*multiple/3;
			
				if(inReceptorCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerReceptorX_cell1 , centerReceptorY_cell1 ,receptorRadius)){
					countCal_1++;
					clearRec3Paper();
					receiveMoleculeNumber3(countCal_1, 265,325);
					if(countCal_1 >= numberOfMoleculesCal*thresholdReceptor/100)
						ER_pushCheck_1 = 0;
				}
				
				if(inReceptorCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerReceptorX_cell2 , centerReceptorY_cell2 ,receptorRadius)){
					countCal_2++;
					clearRec4Paper();
					receiveMoleculeNumber4(countCal_2, 515,325);
					if(countCal_2 >= numberOfMoleculesCal*thresholdReceptor/100){
						ER_pushCheck_2 = 0;
						inputReceivedTrue = 1;
						drawMakeItGreen(makeItGreen);
					}
				}
				
				if(passCellCheck(moleculesCal[i].x, moleculesCal[i].y,moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, passageX_1, passageY_1, passageX_1, passageY_1+passageLength)
					|| passCellCheck(moleculesCal[i].x, moleculesCal[i].y,moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, passageX_2, passageY_2, passageX_2, passageY_2+passageLength)
					|| passCellCheck(moleculesCal[i].x, moleculesCal[i].y,moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, passageX_3, passageY_3, passageX_3, passageY_3+passageLength)){
					moleculesCal[i].x += tempGaussX;
					moleculesCal[i].y += tempGaussY;
				}
			
				else if(moleculesCal[i].x < X+cellLength){
					if(inCellCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, X, Y, cellLength, cellWidth) && 
								!inCellCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, nucX_cell1, nucY_cell1, nucLength, nucWidth)
							&& !inERCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerERX_cell1, centerERY_cell1)){
						moleculesCal[i].x += tempGaussX;
						moleculesCal[i].y += tempGaussY;
					}
					else if(ER_pushCheck_1 == 0 && inERCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerERX_cell1, centerERY_cell1)){
						moleculesCal.splice(i,1);
					}
					
				}
				else if(moleculesCal[i].x >= X+cellLength){
					if(inCellCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY,X+cellLength,Y,cellLength, cellWidth)
						&& !inCellCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, nucX_cell2, nucY_cell2, nucLength, nucWidth)
							&& !inERCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerERX_cell2, centerERY_cell2)){
						moleculesCal[i].x += tempGaussX;
						moleculesCal[i].y += tempGaussY;
					}
					else if(ER_pushCheck_2 == 0 && inERCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerERX_cell2, centerERY_cell2)){
						moleculesCal.splice(i,1);
					}
				}
				else{
					//no move for this molecule in this round
				}
			
        }
		countCal_1 = 0;
		countCal_2 = 0;

        $scope.view.moleculesIP3 = moleculesIP3;
		$scope.view.moleculesCal = moleculesCal;
    };
	
	
	/*
	It controls the actions when the initialize button is pressed.It is the main visual function. It creates the 
	static visual objects such as timer, scaler, counters, cells and its parts(endoplasmic reticulum, nucleus, 
	receptors, passages etc.) and all the writings in the page. Also it checks the validity of the parameters 
	that user enter and don’t accept the invalid parameters and replace them with default ones. 
	*/
    $scope.init = function () {

        var numberOfMoleculesLocal, numberOfMoleculesCalLocal,radiusLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
		var inputStreamFirst;
		
		refreshNow = 0;
		countIP3_1 = 0;
		countIP3_2 = 0;
		countCal_1 = 0;
		countCal_2 = 0;
		countIP3_passed = 0;
		totalArrive = 0;
		correctData = 0
		moleculesIP3 = [];
		moleculesCal = [];
		clearPaper();
		localTime = 0;
		initCover();
		
		distanceBetweenTwoCellsLocal = $scope.view.distanceBetweenTwoCells;
		radiusLocal = $scope.view.cellRadius;
		temperature = $scope.view.temperature;
		viscosity = $scope.view.viscosity;
		symbolDuration = $scope.view.symbolDuration;
		
		inputStream = $scope.view.inputStream;
		
		moleculeSize = $scope.view.moleculeSize;
        environmentMoleculeSize = $scope.view.environmentMoleculeSize;
		numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		numberOfMoleculesCalLocal = $scope.view.numberOfMoleculesCal;
		numberOfMolecules = $scope.view.numberOfMolecules;
		numberOfMoleculesCal = $scope.view.numberOfMoleculesCal;
			
		if(void 0 == numberOfMolecules){
			numberOfMoleculesLocal = 100;
			numberOfMolecules = 100;
			$scope.view.numberOfMolecules = 100;
		}
		if(void 0 == numberOfMoleculesCal){
			numberOfMoleculesCalLocal = 40;
			numberOfMoleculesCal = 40;
			$scope.view.numberOfMoleculesCal = 40;
		}
		if(void 0 == symbolDuration){
			symbolDuration = 60;
			$scope.view.symbolDuration = 60;
		}	
		if(void 0 == distanceBetweenTwoCellsLocal){
			distanceBetweenTwoCellsLocal = 7;
			$scope.view.distanceBetweenTwoCells = 7;
		}	
		if(void 0 == radiusLocal){
			radiusLocal = 15;
			$scope.view.cellRadius = 15;
		}	
		if(void 0 == temperature){
			temperature = 320;
			$scope.view.temperature = 320;
		}	
		if(void 0 == viscosity){
			viscosity = 0.01;
			$scope.view.viscosity = 0.01;
		}	
		if(void 0 == moleculeSize){
			moleculeSize = 10;
			$scope.view.moleculeSize = 10;
		}	
		if(void 0 == environmentMoleculeSize){
			environmentMoleculeSize = 10;
			$scope.view.environmentMoleculeSize = 10;
		}	
		if(void 0 == inputStream){
			inputStream = "1101"; 
			$scope.view.inputStream = "1101";
		}	
		else if(inputStream.search(/^[01]+$/) == -1){
			inputStream = "1101"; 
			$scope.view.inputStream = "1101";
		}
		
		inputStreamFirst = inputStream.split("",1);
	
		lastValues[0] = symbolDuration;
		lastValues[1] = numberOfMolecules;
		lastValues[2] = distanceBetweenTwoCellsLocal;
		lastValues[3] = radiusLocal;
		lastValues[4] = temperature;
		lastValues[5] = viscosity;
		lastValues[6] = moleculeSize;
		lastValues[7] = inputStream;
		lastValues[8] = environmentMoleculeSize,
		lastValues[9] = numberOfMoleculesCal;
		
		radiusT = Number(50 + radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		radiusR = Number(SIZE_X - 50 - radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		cellRadiusLocal = Number(radiusLocal * locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		
		drawScaler(multiple);
		drawRepresentatives(250,30,6);		//250 represents X coordinates of circles and 30 represents Y coordinate of 
												//first circle and 6 represents radius of circles
		drawEmptyClock(0);
		drawEmptyClock(1);
		receiveCount();
		drawInputStream(inputStream);
		
		
		
		drawCellRect(X,Y,cellLength,cellWidth);		//Draw receiver cell
		drawCellRect(X+Number(cellLength),Y,cellLength,cellWidth);		//Draw transmitter cell
		
		drawER(centerERX_cell1, centerERY_cell1, ER_rHor, ER_rVer);		//for cell 1
		drawNucleus(nucX_cell1, nucY_cell1, nucLength, nucWidth);		//for cell 1
		
		drawER(centerERX_cell2, centerERY_cell2, ER_rHor, ER_rVer);		//for cell 2
		drawNucleus(nucX_cell2, nucY_cell2, nucLength, nucWidth);		//for cell 2
		
		drawCalciumReceptor(centerReceptorX_cell1,centerReceptorY_cell1, receptorRadius);
		drawCalciumReceptor(centerReceptorX_cell2,centerReceptorY_cell2, receptorRadius);
		
		drawPassage(passageX_1, passageY_1, passageLength);
		drawPassage(passageX_2, passageY_2, passageLength);
		drawPassage(passageX_3, passageY_3, passageLength);
        //create moleculesIP3
		if(inputStreamFirst[0]==1){
			color = 1;
			for (var i = 0; i < numberOfMoleculesLocal; i++) {
				moleculesIP3.push({ x: initialX, y: initialY });
			}
			makeItGreen = 1;
		}
		else{
			color = 0;
		}

        $scope.view.moleculesIP3 = moleculesIP3;
		$scope.view.moleculesCal = moleculesCal;
        $scope.view.show = false;
		$scope.view.notShow = true;
		$scope.view.showIterate = true;
		
        initRaphael();

        drawAllMolecules();
    };

	/*
	It controls the actions when the refresh button is pressed. It replace default parameter values with 
	the last values that user enter and run the simulation. Apart from that it convert the simulation to 
	initial state. 
	*/
	$scope.refresh = function(){
		
		refreshNow = 1;
		countIP3_1 = 0;
		countIP3_2 = 0;
		countCal_1 = 0;
		countCal_2 = 0;
		countIP3_passed = 0;
		totalArrive = 0;
		correctData = 0;
		ER_pushCheck_1 = 1;
		ER_pushCheck_2 = 1;
		inputReceivedTrue = 0;
		makeItGreen = 0;
		outputStream = "";
		clearPaper();
		clearCover();
		clearRec1Paper();
		clearRec2Paper();
		clearRec3Paper();
		clearRec4Paper();
		clearClockPaper();
		moleculesIP3 = [];
		moleculesCal = [];
		$scope.view = {
			moleculesIP3: [],
			iterationTime: 0.5,   //sec
			numberOfMolecules: lastValues[1],
			numberOfMoleculesCal: lastValues[9],
			maxTime: 40000,
			currentTime: 0,
			distanceBetweenTwoCells: lastValues[2],
			cellRadius: lastValues[3],
			temperature: lastValues[4],
			viscosity: lastValues[5],
			moleculeSize: lastValues[6],
			environmentMoleculeSize: lastValues[8],
			threshold: 30,
			thresholdER: 35,
			thresholdReceptor: 20,
			thresholdPassage: 4,
			symbolDuration: lastValues[0],
			inputStream: lastValues[7],
			outputStream: "",
			show:true,
			notShow: false,
			showIterate: false,
		};
		
	};
	
	/*
	It controls the actions when the run button is pressed. It decides in given time interval which 
	molecules go where. Also it controls the dynamic visual parts of the simulation.
	*/
    $scope.iterateSimulation = function () {
		var inputStreamArr = [];
		var clockSize = 0, clockSizeOut = 0;
		var symbolInputLength;
		inputStreamArr = inputStream.split("");
        var localTime = 0, calReleased= 0, calReleased_2= 0, IP3released =0;
		var localIterationTime = $scope.view.iterationTime;
		symbolInputLength = symbolDuration*inputStreamArr.length; 
		var distanceBetweenTwoCellsLocal, numberOfMoleculesLocal, index;
		index = 1;
		distanceBetweenTwoCellsLocal = $scope.view.distanceBetweenTwoCells;

		numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		numberOfMoleculesCalLocal = $scope.view.numberOfMoleculesCal;
		
		
        var iterate = function () {
			$scope.view.showIterate = false;
            clearPaper();
            iterateMolecules();
            drawAllMolecules();
            localTime += localIterationTime*10;	//iteration time ile alakalý
			if(countIP3_1 >= numberOfMoleculesLocal*thresholdER/100 && calReleased == 0){
				for (var i = 0; i < numberOfMoleculesCalLocal; i++) {
					moleculesCal.push({ x: 250, y: 237 });			//initial values of cal mol places
				}
				calReleased = 1;
				ER_pushCheck_1 = 1;
			}
			if(countIP3_2 >= numberOfMoleculesLocal*thresholdER/100 && calReleased_2 == 0){
				for (var i = 0; i < numberOfMoleculesCalLocal; i++) {
					moleculesCal.push({ x: 500, y: 237 });			//initial values of cal mol places
				}
				inputReceivedTrue = 0;
				calReleased_2 = 1;
				ER_pushCheck_2 = 1;
			}
			if(countIP3_passed >= numberOfMoleculesLocal*thresholdPassage/100 && IP3released == 0){
				for (var i = 0; i < numberOfMoleculesLocal; i++) {
					moleculesIP3.push({ x: initialX+cellLength, y: initialY });
				}
				IP3released = 1;
			}
            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
				$scope.$apply(threshold = $scope.view.threshold);
				$scope.$apply(thresholdER = $scope.view.thresholdER);
				$scope.$apply(thresholdReceptor = $scope.view.thresholdReceptor);
				$scope.$apply(thresholdPassage = $scope.view.thresholdPassage);
            }
			if(localTime % (100*symbolDuration) == 0){
				receiveCount();
				calReleased = 0;
				calReleased_2 = 0;
				IP3released = 0;
				
				countIP3_passed = 0;
				if(Number(inputStreamArr[index])== 1){
					countIP3_2 = 0;
					countIP3_1 = 0;
					makeItGreen = 1;
					color = 1;
					for (var i = 0; i < numberOfMoleculesLocal; i++) {
							moleculesIP3.push({ x: initialX, y: initialY });
					}
					
					if(inputReceivedTrue == 1){
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else{
							drawFalse(index-1, inputStreamArr.length, 1);	
						}
					}
					else{
						if(Number(inputStreamArr[index-1])== 1){
							drawFalse(index-1, inputStreamArr.length, 0);
						}
						else{
							drawTrue(index-1, inputStreamArr.length, 0);
							correctData++;
						}
					}
					inputReceivedTrue = 0;
					$scope.view.moleculesIP3 = moleculesIP3;
					index++;
				}
				else{
					makeItGreen = 0;
					countIP3_1 = 0;
					countIP3_2 = 0;
					color = 0;
					if(inputReceivedTrue == 1){
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else{
							drawFalse(index-1, inputStreamArr.length, 1);
							}
					}
					else{
						if(Number(inputStreamArr[index-1])== 1){
							drawFalse(index-1, inputStreamArr.length, 0);
							}
						else{
							drawTrue(index-1, inputStreamArr.length, 0);
							correctData++;	
						}
					}
					index++;
					inputReceivedTrue = 0;
				}
				
				$scope.$apply($scope.view.outputStream = outputStream);
				clockSizeOut = 0;
			}
			if(refreshNow == 1){
				localTime = 0;
				$scope.$apply($scope.view.currentTime = localTime / 100);
			}
            else if (!(localTime > 100*symbolInputLength)) {
				drawClock(((clockSize)/symbolInputLength)*3/2,inputStreamArr.length);
				drawOutput(((clockSizeOut)/symbolInputLength)*3/2,inputStreamArr.length, index-1);
				clockSize+=5;
				clockSizeOut+=5;
                setTimeout(function () { iterate(); }, 50);
            }
			else{
				//showStatistics(symbolInputLength,totalArrive,correctData,inputStreamArr.length); //showing statistics
			}
        }
        iterate();
    };


};