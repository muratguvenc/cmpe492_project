/// <reference path="../../../Scripts/angular.1.09.js" />


function CalciumSignalingController($scope) {
	var SIZE_X = 600 , SIZE_Y = 400;
	var cellLength=250,cellWidth=200,X=50,Y=100;
	var	centerERX=175, centerERY=250, ER_rHor=110, ER_rVer=30;
	var nucX = 120, nucY = 110, nucWidth = 80, nucLength=150;
    var mean, stdDev, numberOfMolecules, initialX, initialY, distanceBetweenTwoCells, environmentMoleculeSize, boltzmanCoeff, 
		temperature, viscosity, moleculeSize, cellRadius, inputStream, molecules, threshold, cellRadiusLocal, multiple, symbolDuration,
		lastValues = new Array(), statistics = new Array() ,color, totalArrive = 0, correctData = 0;
	
	var countMolecules = 0;
	var localTime = 0;
	var refreshNow = 0;
    
	molecules = [];
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
    moleculeSize = 1;   //nanometer
	threshold = 30;
	symbolDuration = 5; //sec
	inputStream = "10110101";
	outputStream = "";
	
    $scope.view = {
		symbolDuration: 5, //sec
        molecules: [],
        iterationTime: 0.05,   //sec
        numberOfMolecules: 100,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 7,
		cellRadius: 15,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 1,
		environmentMoleculeSize: 1.32,
		threshold: 30,
		inputStream: "10110101",
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

        if (environmentMoleculeSize > moleculeSize + 0.1) {
            return Math.sqrt(((boltzmanCoeff * temperature)
                    / (3 * Math.PI * viscosity  * moleculeSize)) * time);
        }
        return Math.sqrt(((boltzmanCoeff * temperature)
                    / (2 * Math.PI * viscosity  * moleculeSize)) * time);
    }

    function drawAllMolecules() {
        var moleculesLocal;

        moleculesLocal = $scope.view.molecules;     //for performance increase

        for (var i = 0; i < moleculesLocal.length; i++) {
            drawCircle(moleculesLocal[i].x, moleculesLocal[i].y, 1);
        }
    };
	
	function inCellCheck(dX,dY, sX, sY, sL, sW){
		if((dY<=sY) || (dX<=sX)){
			return false;
		}
		else{
			if((dY>=sY+sW) || (dX>=sX+sL)){
				return false;
			}
			else{
				return true;
			}
			return false;
		}
		return false;
	
	}
	
	
	function inERCheck(dX,dY){
		var inER=((dX-centerERX)*(dX-centerERX))/((ER_rHor)*(ER_rHor))+((dY-centerERY)*(dY-centerERY))/((ER_rVer)*(ER_rVer));
		if(inER<=1){
			return true;
		}
		return false;
	}

    function iterateMolecules() {
        var stdDev, tempGaussX, tempGaussY;

        stdDev = caculatePropagationStandardDeviation($scope.view.iterationTime);

        molecules = $scope.view.molecules;

        for (var i = 0; i < molecules.length; i++) {
			
			tempGaussX = generateGaussianRandom(stdDev)*multiple;
			tempGaussY = generateGaussianRandom(stdDev)*multiple;
			
			if(inCellCheck(molecules[i].x+tempGaussX, molecules[i].y + tempGaussY,X,Y,cellLength, cellWidth) && !inERCheck(molecules[i].x+tempGaussX, molecules[i].y + tempGaussY) && 
						!inCellCheck(molecules[i].x+tempGaussX, molecules[i].y + tempGaussY, nucX, nucY, nucLength, nucWidth)){
				molecules[i].x += tempGaussX;
				molecules[i].y += tempGaussY;
			}
			else{
				
			}
            
        }

        $scope.view.molecules = molecules;
    };

    $scope.init = function () {

        var numberOfMoleculesLocal,radiusLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
		var inputStreamFirst;
		
		refreshNow = 0;
		countMolecules = 0;
		totalArrive = 0;
		correctData = 0
		molecules = [];
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
			symbolDuration = 5;
			$scope.view.symbolDuration = 5;
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
			inputStream = "10110101"; 
			$scope.view.inputStream = "10110101";
		}	
		else if(inputStream.search(/^[01]+$/) == -1){
			inputStream = "10110101"; 
			$scope.view.inputStream = "10110101";
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
		
		drawER(centerERX, centerERY, ER_rHor, ER_rVer);
		drawNucleus(nucX, nucY, nucLength, nucWidth);
        //create molecules
		if(inputStreamFirst[0]==1){
			color = 1;
			for (var i = 0; i < numberOfMoleculesLocal; i++) {
				molecules.push({ x: initialX, y: initialY });
			}
		}
		else{
			color = 0;
		}

        $scope.view.molecules = molecules;
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
		refreshNow = 1;
		countMolecules = 0;
		totalArrive = 0;
		correctData = 0;
		outputStream = "";
		clearPaper();
		clearCover();
		clearRecPaper();
		clearClockPaper();
		molecules = [];
		$scope.view = {
			molecules: [],
			iterationTime: 0.05,   //sec
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
		
	};
	
    $scope.iterateSimulation = function () {
		var inputStreamArr = [];
		var clockSize = 0, clockSizeOut = 0;
		var symbolInputLength;
		inputStreamArr = inputStream.split("");
        localTime = 0;
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
            localTime += 5;	
            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
				$scope.$apply(threshold = $scope.view.threshold);
            }
			if(localTime % (100*symbolDuration) == 0){
				receiveCount(2);
				if(Number(inputStreamArr[index])== 1){
					color = 1;
					for (var i = 0; i < numberOfMoleculesLocal; i++) {
							molecules.push({ x: initialX, y: initialY });
					}
					if(countMolecules >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalse(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1)
							drawFalse(index-1, inputStreamArr.length, 0);
						else{
							drawTrue(index-1, inputStreamArr.length, 0);
							correctData++;
						}
					}
					$scope.view.molecules = molecules;
					index++;
				}
				else{
					color = 0;
					if(countMolecules >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1){
							drawTrue(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalse(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countMolecules = 0;
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