/// <reference path="../../../Scripts/angular.1.09.js" />


function DiffusionController($scope) {
	var SIZE_X = 600 , SIZE_Y = 400;
	
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
    initialX = 176;
    initialY = SIZE_Y/2;
	distanceBetweenTwoCells = 6;	//mikrometre
	cellRadius = 8;
    environmentMoleculeSize = 1.32; //nanometer
    boltzmanCoeff = 0.000086173324;
    temperature = 310; //kelvin
    viscosity = 0.001; // ( kg / (s * m) )
    moleculeSize = 1;   //nanometer
	threshold = 30;
	symbolDuration = 8; //sec
	inputStream = "10111001";
	outputStream = "";
	
    $scope.view = {
		symbolDuration: 8, //sec
        molecules: [],
        iterationTime: 0.05,   //sec
        numberOfMolecules: 100,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 6,
		cellRadius: 8,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 1,
		environmentMoleculeSize: 1.32,
		threshold: 30,
		inputStream: "10111001",
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
	
	/*
	It  takes radius(radius of receiver and transmitter cell) and distance(distance between these two cells) 
	and calculates the multiple which is used to calculate location of center and speed of molecules.
	*/
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
	It  draw molecules to screen.
	*/
    function drawAllMolecules() {
        var moleculesLocal;

        moleculesLocal = $scope.view.molecules;     //for performance increase

        for (var i = 0; i < moleculesLocal.length; i++) {
            drawCircleDiffusion(moleculesLocal[i].x, moleculesLocal[i].y, 1);
        }
    };
	
	
	/*
	It takes ax and ay(x and y coordinates of molecules initial point) bx and by(x and y coordinates of molecules ending point) 
	cell(type of cell receiver or transmitter, cellRadius(radius of a cell) as a parameter. Then calculates 
	whether a molecule will enter a given cell at next iteration or not. Return true if molecule will enter 
	the cell, false otherwise. In this method, even if the endpoint of a molecule is not inside the cell 
	it can return true because molecule can enter and exit a cell in one iteration time.)
	*/
	function lineInCircle(ax, ay, bx, by, cell, cellRadius){
		
		if(cell==0){
			var cx = 50 + cellRadius;
			var cy = SIZE_Y/2;
		}else{
			var cx = SIZE_X - 50 - cellRadius;
			var cy = SIZE_Y/2;
		}
		//var cr =  calculateRadius($scope.view.distanceBetweenTwoCells);
		var cr = cellRadius;
		var vx = bx - ax;
		var vy = by - ay;
		var xdiff = ax - cx;
		var ydiff = ay - cy;
		var a = vx*vx + vy*vy;
		var b = 2 * ((vx * xdiff) + (vy * ydiff));
		var c = xdiff * xdiff + ydiff * ydiff - cr * cr;
		var quad = b*b - (4 * a * c);
		if (quad >= 0)
		{
			// An infinite collision is happening, but let's not stop here
			var quadsqrt=Math.sqrt(quad);
			
			root1 = (-b - quadsqrt)/(2*a);
			root2 = (-b + quadsqrt)/(2*a);
			if(root1 > 1)
				return false;	//No collision
			if(root2 < 0)
				return false;
			return true;
			
		}
		return false;
}
	/*
	It is the main function that controls molecules movement. Firstly it checks whether a molecule will 
	go into a receiver or not. If molecule will enter a receiver cell at next iteration it destroy that 
	molecules (because it is absorbed by the  receiver) and update the relevant counter. After that it 
	checks whether a molecule will enter a transmitter cell at next iteration or not. If it will not 
	enter the transmitter cell it allows a molecule to reach it’s destination, otherwise it does not 
	allow moving that molecule in that iteration.
	*/
    function iterateMolecules() {
        var stdDev, tempGaussX, tempGaussY;

        stdDev = caculatePropagationStandardDeviation($scope.view.iterationTime);

        molecules = $scope.view.molecules;

        for (var i = 0; i < molecules.length; i++) {
			
			tempGaussX = generateGaussianRandom(stdDev)*multiple;
			tempGaussY = generateGaussianRandom(stdDev)*multiple;
			
			if(lineInCircle(molecules[i].x, molecules[i].y, molecules[i].x+Number(tempGaussX), molecules[i].y+Number(tempGaussY),1,cellRadiusLocal)){
		    		molecules.splice(i,1);
					countMolecules++;
					totalArrive++;
					clearRecPaperDiffusion();
					receiveMoleculeNumberDiffusion(countMolecules);
					if(countMolecules >= numberOfMolecules*threshold/100){
						receiveCountDiffusion(color);
					}
					else{
						receiveCountDiffusion(2);
					}
			}
			else if(!lineInCircle(molecules[i].x, molecules[i].y, molecules[i].x+Number(tempGaussX), molecules[i].y+Number(tempGaussY),0, cellRadiusLocal)){//inCellvTwo(moleculesLocal[i].x+Number(tempGaussX), moleculesLocal[i].y+Number(tempGaussY),0)){
				molecules[i].x += tempGaussX;
				molecules[i].y += tempGaussY;
			}else{
			    //moleculesLocal[i].x -= tempGaussX;
				//moleculesLocal[i].y -= tempGaussY;
			}
            
        }

        $scope.view.molecules = molecules;
    };

	
	/*
	It controls the actions when the initialize button is pressed.It is the main visual function. It creates the 
	static visual objects such as timer, scaler, counter and cells  and all the writings in the page. Also it checks the validity of the parameters 
	that user enter and don’t accept the invalid parameters and replace them with default ones. 
	*/
    $scope.init = function () {

        var numberOfMoleculesLocal,radiusLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
		var inputStreamFirst;
		
		refreshNow = 0;
		countMolecules = 0;
		totalArrive = 0;
		correctData = 0
		molecules = [];
		clearPaperDiffusion();
		localTime = 0;
		initCoverDiffusion();
		
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
			symbolDuration = 8;
			$scope.view.symbolDuration = 8;
		}	
		if(void 0 == distanceBetweenTwoCellsLocal){
			distanceBetweenTwoCellsLocal = 6;
			$scope.view.distanceBetweenTwoCells = 6;
		}	
		if(void 0 == radiusLocal){
			radiusLocal = 8;
			$scope.view.cellRadius = 8;
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
			inputStream = "10111001"; 
			$scope.view.inputStream = "10111001";
		}	
		else if(inputStream.search(/^[01]+$/) == -1){
			inputStream = "10111001"; 
			$scope.view.inputStream = "10111001";
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
		
		drawScalerDiffusion(multiple);
		drawEmptyClockDiffusion(0);
		drawEmptyClockDiffusion(1);
		receiveCountDiffusion(2);
		drawInputStreamDiffusion(inputStream);
		
		initialX = 51 + 2*cellRadiusLocal;
		
		//temp = 300 - Number(distanceBetweenTwoCellsLocal)/2;
		drawCellCircleDiffusion(radiusT,SIZE_Y/2,cellRadiusLocal);		//Draw receiver cell
		drawCellCircleDiffusion(radiusR,SIZE_Y/2,cellRadiusLocal);		//Draw transmitter cell
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
		
        initRaphaelDiffusion();

        drawAllMolecules();
    };
	
	$scope.refresh = function(){
		refreshNow = 1;
		countMolecules = 0;
		totalArrive = 0;
		correctData = 0;
		outputStream = "";
		clearPaperDiffusion();
		clearCoverDiffusion();
		clearRecPaperDiffusion();
		clearClockPaperDiffusion();
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
		$scope.view.showIterate = false;
		numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		
        var iterate = function () {
			
            clearPaperDiffusion();
            iterateMolecules();
            drawAllMolecules();
            localTime += 5;	
            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
				$scope.$apply(threshold = $scope.view.threshold);
            }
			if(localTime % (100*symbolDuration) == 0){
				receiveCountDiffusion(2);
				if(Number(inputStreamArr[index])== 1){
					color = 1;
					for (var i = 0; i < numberOfMoleculesLocal; i++) {
							molecules.push({ x: initialX, y: initialY });
					}
					if(countMolecules >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1){
							drawTrueDiffusion(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalseDiffusion(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1)
							drawFalseDiffusion(index-1, inputStreamArr.length, 0);
						else{
							drawTrueDiffusion(index-1, inputStreamArr.length, 0);
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
							drawTrueDiffusion(index-1, inputStreamArr.length, 1);
							correctData++;
						}
						else
							drawFalseDiffusion(index-1, inputStreamArr.length, 1);
					}
					else{
						outputStream += 0;
						countMolecules = 0;
						if(Number(inputStreamArr[index-1])== 1)
							drawFalseDiffusion(index-1, inputStreamArr.length, 0);
						else{
							drawTrueDiffusion(index-1, inputStreamArr.length, 0);
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
				drawClockDiffusion(((clockSize)/symbolInputLength)*3/2,inputStreamArr.length);
				drawOutputDiffusion(((clockSizeOut)/symbolInputLength)*3/2,inputStreamArr.length, index-1);
				clockSize+=5;
				clockSizeOut+=5;
                setTimeout(function () { iterate(); }, 50);
            }
			else{
				showStatisticsDiffusion(symbolInputLength,totalArrive,correctData,inputStreamArr.length);
			}
        }
        iterate();
    };


};