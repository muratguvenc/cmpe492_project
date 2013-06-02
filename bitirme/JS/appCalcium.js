/// <reference path="../../../Scripts/angular.1.09.js" />


function CalciumSignalingController($scope) {
	var SIZE_X = 600 , SIZE_Y = 400;
	var cellLength=250,cellWidth=200,X=50,Y=100;
	var	centerERX_cell1=175, centerERY_cell1=260, centerERX_cell2=425, centerERY_cell2=260, ER_rHor=110, ER_rVer=30;
	var nucX_cell1 = 90, nucY_cell1 = 120, nucX_cell2 = 340, nucY_cell2 = 120, nucWidth = 75, nucLength=130;
	var passageX_1 = 300, passageY_1 = 139, passageX_2 = 300, passageY_2 = 192, passageX_3 = 300, passageY_3=245, passageLength = 14;
	var centerReceptorX_cell1 = 265 , centerReceptorY_cell1 = 180, centerReceptorX_cell2 = 515 , centerReceptorY_cell2 = 180 ,receptorRadius = 20;
    var mean, stdDev, numberOfMolecules, initialX, initialY, distanceBetweenTwoCells, environmentMoleculeSize, boltzmanCoeff, 
		temperature, viscosity, moleculeSize, cellRadius, inputStream, moleculesIP3, moleculesCal, threshold, cellRadiusLocal, multiple, symbolDuration,
		lastValues = new Array(), statistics = new Array() ,color, totalArrive = 0, correctData = 0;
	
	var countIP3_1 = 0, countIP3_2 = 0, countCal_1 = 0, countCal_2 = 0, countIP3_passed = 0;
	var localTime = 0;
	var refreshNow = 0;
	var ER_pushCheck_1 = 1, ER_pushCheck_2 = 1;
    
	moleculesIP3 = [];
	moleculesCal = [];
	mean = 0;
	color = 2;
    numberOfMolecules = 100;
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
	symbolDuration = 50; //sec
	inputStream = "1101";
	outputStream = "";
	
    $scope.view = {
		symbolDuration: 50, //sec
        moleculesIP3: [],
		moleculesCal: [],
        iterationTime: 0.5,   //sec
        numberOfMolecules: 100,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 7,
		cellRadius: 15,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 2.5,
		environmentMoleculeSize: 1.32,
		threshold: 30,
		inputStream: "1101",
		outputStream: "",
        show:true,
		notShow: false,
		showIterate: false,
    };

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

    function caculatePropagationStandardDeviation(time) {

		//return Math.sqrt(2*150*time);
		
        if (environmentMoleculeSize > moleculeSize + 0.1) {
            return Math.sqrt(((boltzmanCoeff * temperature)
                    / (3 * Math.PI * viscosity  * moleculeSize)) * time);
        }
        return Math.sqrt(((boltzmanCoeff * temperature)
                    / (2 * Math.PI * viscosity  * moleculeSize)) * time);
    }

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
	
	function inReceptorCheck(moleculeX, moleculeY, receptorX, receptorY, recRadius){
		if(recRadius*recRadius >= ((moleculeX-receptorX)*(moleculeX-receptorX))+((moleculeY-receptorY)*(moleculeY-receptorY))){
			return true;
		}
		return false;
	}
	
	function inCellCheck(dX, dY, sX, sY, sL, sW){
		if((dY>=sY) && (dX>=sX) && (dX<=sX+sL) && (dY<=sY+sW)){
			return true;
		}
		return false;
	
	}
	/*
	Controlling if a molecule passing through passage or not, if it passes function returns true
		if not returns false
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
	
	
	function inERCheck(dX,dY,cen_ERX,cen_ERY){
		var inER=((dX-cen_ERX)*(dX-cen_ERX))/((ER_rHor)*(ER_rHor))+((dY-cen_ERY)*(dY-cen_ERY))/((ER_rVer)*(ER_rVer));
		if(inER<=1){
			return true;
		}
		return false;
	}

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
				clearRecPaper();
				receiveMoleculeNumber(countIP3_1, 565);
			}
			
			else if(inERCheck(moleculesIP3[i].x+tempGaussX, moleculesIP3[i].y + tempGaussY , centerERX_cell2, centerERY_cell2) ){
				countIP3_2++;
				moleculesIP3.splice(i,1);
				totalArrive++;
				clearRecPaper();
				receiveMoleculeNumber(countIP3_2, 365);
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
					//clearCalPaper();
					//drawCountCal(countCal_1);
					if(countCal_1 >= 10)
						ER_pushCheck_1 = 0;
				}
				
				if(inReceptorCheck(moleculesCal[i].x+tempGaussX, moleculesCal[i].y + tempGaussY, centerReceptorX_cell2 , centerReceptorY_cell2 ,receptorRadius)){
					countCal_2++;
					clearCalPaper();
					drawCountCal(countCal_2);
					if(countCal_2 >= 10)
						ER_pushCheck_2 = 0;
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

    $scope.init = function () {

        var numberOfMoleculesLocal,radiusLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
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
		numberOfMolecules = $scope.view.numberOfMolecules;
			
		if(void 0 == numberOfMolecules){
			numberOfMoleculesLocal = 100;
			numberOfMolecules = 100;
			$scope.view.numberOfMolecules = 100;
		}
		if(void 0 == symbolDuration){
			symbolDuration = 50;
			$scope.view.symbolDuration = 50;
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
		
		radiusT = Number(50 + radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		radiusR = Number(SIZE_X - 50 - radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		cellRadiusLocal = Number(radiusLocal * locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		
		drawScaler(multiple);
		drawEmptyClock(0);
		drawEmptyClock(1);
		receiveCount(2);
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
		}
		else{
			color = 0;
		}
		/*for (var i = 0; i < numberOfMoleculesLocal; i++) {
				moleculesCal.push({ x: 250, y: 237 });			//initial values of cal mol places
		}*/

        $scope.view.moleculesIP3 = moleculesIP3;
		$scope.view.moleculesCal = moleculesCal;
        $scope.view.show = false;
		$scope.view.notShow = true;
		$scope.view.showIterate = true;
		
        initRaphael();

        drawAllMolecules();
    };
	
    $scope.drawRandomMolecule = function () {

        var x = Math.floor(Math.random() * SIZE_X);    // max 600 because of canvas size, see raphael.js under Js folder
        var y = Math.floor(Math.random() * SIZE_Y);
        drawCircle(x, y, 1);
    };
	
	$scope.refresh = function(){
		/*
		refreshNow = 1;
		countIP3_1 = 0;
		count
		totalArrive = 0;
		correctData = 0;
		outputStream = "";
		clearPaper();
		clearCover();
		clearRecPaper();
		clearClockPaper();
		moleculesIP3 = [];
		$scope.view = {
			moleculesIP3: [],
			iterationTime: 0.5,   //sec
			numberOfMolecules: lastValues[1],
			maxTime: 40000,
			currentTime: 0,
			distanceBetweenTwoCells: lastValues[2],
			cellRadius: lastValues[3],
			temperature: lastValues[4],
			viscosity: lastValues[5],
			moleculeSize: lastValues[6],
			environmentMoleculeSize: lastValues[8],
			threshold: 30,
			symbolDuration: lastValues[0],
			inputStream: lastValues[7],
			outputStream: "",
			show:true,
			notShow: false,
			showIterate: false,
		};
		*/
	};
	
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
		
        var iterate = function () {
			$scope.view.showIterate = false;
            clearPaper();
            iterateMolecules();
            drawAllMolecules();
            localTime += localIterationTime*10;	//iteration time ile alakalý
			if(countIP3_1 >= 35 && calReleased == 0){
				for (var i = 0; i < numberOfMoleculesLocal; i++) {
					moleculesCal.push({ x: 250, y: 237 });			//initial values of cal mol places
				}
				calReleased = 1;
				ER_pushCheck_1 = 1;
			}
			if(countIP3_2 >= 35 && calReleased_2 == 0){
				for (var i = 0; i < numberOfMoleculesLocal; i++) {
					moleculesCal.push({ x: 500, y: 237 });			//initial values of cal mol places
				}
				calReleased_2 = 1;
				ER_pushCheck_2 = 1;
			}
			if(countIP3_passed >= 4 && IP3released == 0){
				for (var i = 0; i < numberOfMoleculesLocal; i++) {
					moleculesIP3.push({ x: initialX+cellLength, y: initialY });
				}
				IP3released = 1;
			}
            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
				$scope.$apply(threshold = $scope.view.threshold);
            }
			if(localTime % (100*symbolDuration) == 0){
				receiveCount(2);
				calReleased = 0;
				calReleased_2 = 0;
				IP3released = 0;
				
				countIP3_passed = 0;
				if(Number(inputStreamArr[index])== 1){
					countIP3_2 = 0;
					color = 1;
					for (var i = 0; i < numberOfMoleculesLocal; i++) {
							moleculesIP3.push({ x: initialX, y: initialY });
					}
					if(countIP3_1 >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countIP3_1 = 0;
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalse(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countIP3_1 = 0;
						if(Number(inputStreamArr[index-1])== 1)
							drawFalse(index-1, inputStreamArr.length, 0);
						else{
							drawTrue(index-1, inputStreamArr.length, 0);
							correctData++;
						}
					}
					$scope.view.moleculesIP3 = moleculesIP3;
					index++;
				}
				else{
					countIP3_2 = 0;
					color = 0;
					if(countIP3_1 >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countIP3_1 = 0;
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalse(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countIP3_1 = 0;
						if(Number(inputStreamArr[index-1])== 1)
							drawFalse(index-1, inputStreamArr.length, 0);
						else{
							drawTrue(index-1, inputStreamArr.length, 0);
							correctData++;
						}
					}
					index++;
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
				showStatistics(symbolInputLength,totalArrive,correctData,inputStreamArr.length);
			}
        }
        iterate();
    };


};