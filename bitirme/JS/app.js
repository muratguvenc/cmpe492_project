/// <reference path="../../../Scripts/angular.1.09.js" />


function DiffusionController($scope) {

    var mean, stdDev, numberOfMolecules, initialX, initialY, distanceBetweenTwoCells, environmentMoleculeSize, boltzmanCoeff, 
		temperature, viscosity, moleculeSize, cellRadius, inputStream, molecules, threshold, cellRadiusLocal, multiple;
	
	var countMolecules = 0;
	var localTime = 0;
	var refreshNow = 0;
    
	molecules = [];
	mean = 0;
    numberOfMolecules = 100;
    initialX = 176;
    initialY = 200;
	distanceBetweenTwoCells = 10;	//mikrometre
	cellRadius = 15;
    environmentMoleculeSize = 1.32; //nanometer
    boltzmanCoeff = 0.000086173324;
    temperature = 310; //kelvin
    viscosity = 0.001; // ( kg / (s * m) )
    moleculeSize = 1;   //nanometer
	threshold = 30;
	inputStream = "1";
	outputStream = "";
	
    $scope.view = {
        molecules: [],
        iterationTime: 0.05,   //sec
        numberOfMolecules: 100,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 10,
		cellRadius: 15,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 1,
		threshold: 30,
		inputStream: "1",
		outputStream: "",
        show:true
    };

    function generateGaussianRandom(stdDev) {

        var u1, u2, randStdNormal;
        u1 = Math.random();
        u2 = Math.random();
        randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); //random normal(0,1);
        return (mean + stdDev * randStdNormal);
    }
	
	function locationOfCenter(radius,distance){
		multiple = Number(500/(4*radius + Number(distance)));
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
	
	
	/*
	
	function inCellvTwo(bX,bY,cell){
		var cX = 175 + 125*cell;
		var cY = 200;
		var radius =  calculateRadius($scope.view.distanceBetweenTwoCells);
		
		var tempX = (bX-cX)*(bX-cX);
		var tempY = (bY-cY)*(bY-cY);
		var distance = tempX +tempY- radius*radius;
		if(distance>0)
			return true;//no collision
		else
			return false;
		
		
	}
	*/
	function lineInCircle(ax, ay, bx, by, cell, cellRadius){
		
		if(cell==0){
			var cx = 50 + cellRadius;
			var cy = 200;
		}else{
			var cx = 600 - 50 - cellRadius;
			var cy = 200;
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

    $scope.init = function () {

        var numberOfMoleculesLocal,radiusLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
		var inputStreamFirst;
		
		refreshNow = 0;
		countMolecules = 0;
		molecules = [];
		clearPaper();
		localTime = 0;
		initCover();
		
		distanceBetweenTwoCellsLocal = $scope.view.distanceBetweenTwoCells;
		radiusLocal = $scope.view.cellRadius;
		temperature = $scope.view.temperature;
		viscosity = $scope.view.viscosity;
		inputStream = $scope.view.inputStream;
		inputStreamFirst = inputStream.split("",1);
		
		moleculeSize = $scope.view.moleculeSize;
        numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		numberOfMolecules = $scope.view.numberOfMolecules;
		
		radiusT = Number(50 + radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		radiusR = Number(600 - 50 - radiusLocal*locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		cellRadiusLocal = Number(radiusLocal * locationOfCenter(radiusLocal,distanceBetweenTwoCellsLocal));
		
		drawScaler(multiple);
		
		initialX = 51 + 2*cellRadiusLocal;
		
		temp = 300 - Number(distanceBetweenTwoCellsLocal)/2;
		drawCellCircle(radiusT,200,cellRadiusLocal);		//Draw receiver cell
		drawCellCircle(radiusR,200,cellRadiusLocal);		//Draw transmitter cell
        //create molecules
		if(inputStreamFirst[0]==1){
			for (var i = 0; i < numberOfMoleculesLocal; i++) {
				molecules.push({ x: initialX, y: initialY });
			}
		}

        $scope.view.molecules = molecules;
        $scope.view.show = false;

        initRaphael();

        drawAllMolecules();
    };
	
    $scope.drawRandomMolecule = function () {

        var x = Math.floor(Math.random() * 600);    // max 600 because of canvas size, see raphael.js under Js folder
        var y = Math.floor(Math.random() * 400);
        drawCircle(x, y, 1);
    };
	
	$scope.refresh = function(){
		refreshNow = 1;
		countMolecules = 0;
		outputStream = "";
		clearPaper();
		clearCover();
		molecules = [];
		$scope.view = {
			molecules: [],
			iterationTime: 0.05,   //sec
			numberOfMolecules: 100,
			maxTime: 40000,
			currentTime: 0,
			distanceBetweenTwoCells: 10,
			cellRadius: 15,
			temperature: 310,
			viscosity: 0.001,
			moleculeSize: 1,
			threshold: 30,
			inputStream: "1",
			outputStream: "",
			show:true
		};
		
	};
	
    $scope.iterateSimulation = function () {
		var inputStreamArr = [];
		inputStreamArr = inputStream.split("");
        localTime = 0;
		var distanceBetweenTwoCellsLocal, numberOfMoleculesLocal, index;
		index = 1;
		distanceBetweenTwoCellsLocal = $scope.view.distanceBetweenTwoCells;

		numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		
        var iterate = function () {
            clearPaper();
            iterateMolecules();
            drawAllMolecules();
            localTime += 5;	
            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
				$scope.$apply(threshold = $scope.view.threshold);
            }
			if(localTime % 1000 == 0){
				alert(threshold+" - "+countMolecules);
				if(Number(inputStreamArr[index])== 1){
					for (var i = 0; i < numberOfMoleculesLocal; i++) {
							molecules.push({ x: initialX, y: initialY });
					}
					if(countMolecules >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countMolecules = 0;
					}
					else{
						outputStream += 0;
						countMolecules = 0;
					}
					$scope.view.molecules = molecules;
					index++;
				}
				else{
					if(countMolecules >= numberOfMolecules*(Number(threshold)/100)){
						outputStream += 1;
						countMolecules = 0;
					}
					else{
						outputStream += 0;
						countMolecules = 0;
					}
					index++;
				}
				$scope.$apply($scope.view.outputStream = outputStream);
			}
			if(refreshNow == 1){
				localTime = 0;
				$scope.$apply($scope.view.currentTime = localTime / 100);
			}
            else if (!(localTime > 1000*inputStreamArr.length)) {
                setTimeout(function () { iterate(); }, 50);
            }
        }
        iterate();
    };


};