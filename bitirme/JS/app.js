/// <reference path="../../../Scripts/angular.1.09.js" />

function DiffusionController($scope) {

    var mean, stdDev, numberOfMolecules, initialX, initialY, distanceBetweenTwoCells, environmentMoleculeSize, boltzmanCoeff, 
		temperature, viscosity, moleculeSize, cellRadius;

    mean = 0;
    numberOfMolecules = 100;
    initialX = 176;
    initialY = 200;
	distanceBetweenTwoCells = 10;	//mikrometre olsun
	cellRadius = 15;
    environmentMoleculeSize = 1.32; //nanometer
    boltzmanCoeff = 0.000086173324;
    temperature = 310; //kelvin
    viscosity = 0.001; // ( kg / (s * m) )
    moleculeSize = 1;   //nanometer

    $scope.view = {
        molecules: [],
        iterationTime: 0.5,   //sec
        numberOfMolecules: 100,
        maxTime: 40000,
        currentTime: 0,
		distanceBetweenTwoCells: 10,
		cellRadius: 15,
		temperature: 310,
		viscosity: 0.001,
		moleculeSize: 1,
        show:true
    };

    function generateGaussianRandom(stdDev) {

        var u1, u2, randStdNormal;
        u1 = Math.random();
        u2 = Math.random();
        randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); //random normal(0,1);
        return (mean + stdDev * randStdNormal);
    }

    function caculatePropagationStandardDeviation(time) {

        if (environmentMoleculeSize > moleculeSize + 0.1) {
            return Math.sqrt(((boltzmanCoeff * temperature)
                    / (3 * Math.PI * viscosity * moleculeSize)) * time);
        }
        return Math.sqrt(((boltzmanCoeff * temperature)
                    / (2 * Math.PI * viscosity * moleculeSize)) * time);
    }

    function drawAllMolecules() {
        var moleculesLocal;

        moleculesLocal = $scope.view.molecules;     //for performance increase

        for (var i = 0; i < moleculesLocal.length; i++) {
            drawCircle(moleculesLocal[i].x, moleculesLocal[i].y, 1);
        }
    };
	
	/*function inCell(aX,aY,bX,bY){
		var cX = 175;
		var cY = 200;
		
		var radius =  calculateRadius($scope.view.distanceBetweenTwoCells);
		
		var baX = bX - aX;
        var baY = bY - aY;
        var caX = cX - aX;
        var caY = cY - aY;
		
		var a = baX * baX + baY * baY;
        var b = baX * caX + baY * caY;
        var c = caX * caX + caY * caY - radius * radius;
		
		var p = b / a;
        var q = c / a;
		
		var disc = p * p - q;
		
		if (disc < 0) {
            return true;
        }else{
			return false
		}

	}*/
	
	
	function inCellvTwo(aX,aY,bX,bY){
		var cX = 175;
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
	
	/*function inCellvThree(aX,aY,bX,bY){
		var cX = 175;
		var cY = 200;
		
		var radius =  calculateRadius($scope.view.distanceBetweenTwoCells);
		
		var dx = (bX-aX);
		var dy = (bY-aY);
		var a = dx * dx + dy * dy;
		var b = 2 * (dx * (aX - cX) + dy * (aY - cY));
		var c = cX * cX + cY * cY;
		c += aX * aX + aY * aY;
		c -= 2 * (cX * aX + cY * aY);
		c -= radius * radius;
		var bb4ac = b * b - 4 * a * c;
		if(bb4ac<0){
          return false;    // No collision
		}else{
          return true;      //Collision
		}
		
			
	}*/

    function iterateMolecules() {
        var moleculesLocal, stdDev, tempGaussX, tempGaussY;

        stdDev = caculatePropagationStandardDeviation($scope.view.iterationTime);

        moleculesLocal = $scope.view.molecules;

        for (var i = 0; i < moleculesLocal.length; i++) {
			
			tempGaussX = generateGaussianRandom(stdDev);
			tempGaussY = generateGaussianRandom(stdDev);
			if(inCellvTwo(moleculesLocal[i].x , moleculesLocal[i].y , moleculesLocal[i].x+Number(tempGaussX), moleculesLocal[i].y+Number(tempGaussY))){
				moleculesLocal[i].x += tempGaussX;
				moleculesLocal[i].y += tempGaussY;
			}else{
			    moleculesLocal[i].x -= tempGaussX;
				moleculesLocal[i].y -= tempGaussY;
			}
            
        }

        $scope.view.molecules = moleculesLocal;
    };

    $scope.init = function () {

        var moleculesLocal, numberOfMoleculesLocal, distanceBetweenTwoCellsLocal, radiusT, radiusR, temp;
		
		drawScaler();
		
		distanceBetweenTwoCellsLocal = $scope.view.distanceBetweenTwoCells;
		moleculesLocal = [];
        numberOfMoleculesLocal = $scope.view.numberOfMolecules;
		cellRadiusLocal =  calculateRadius(distanceBetweenTwoCellsLocal);
		
		temp = 300 - Number(distanceBetweenTwoCellsLocal)/2;
		drawCircle(175,200,cellRadiusLocal);		//Draw receiver cell
		drawCircle(300,200,cellRadiusLocal);			//Draw transmitter cell
        //create molecules
        for (var i = 0; i < numberOfMoleculesLocal; i++) {
            moleculesLocal.push({ x: initialX+Number(cellRadiusLocal), y: initialY });
        }

        $scope.view.molecules = moleculesLocal;
        $scope.view.show = false;

        initRaphael();

        drawAllMolecules();
    };
	
	function calculateRadius(distance){
		if(distance < 5)
			return 45;
		else if( distance > 15 )
			return 15;
		else{
			return (225/Number(distance));
		}
	};
    
    $scope.drawRandomMolecule = function () {

        var x = Math.floor(Math.random() * 600);    // max 600 because of canvas size, see raphael.js under Js folder
        var y = Math.floor(Math.random() * 400);
        drawCircle(x, y, 1);
    };

    $scope.iterateSimulation = function () {

        var localTime = 0;

        var iterate = function () {
            clearPaper();
            iterateMolecules();
            drawAllMolecules();
            localTime += 5;

            if (localTime % 100) {
                $scope.$apply($scope.view.currentTime = localTime / 100);
            }

            if (!(localTime > 1000)) {
                setTimeout(function () { iterate(); }, 50);
            }
        }

        iterate();
    };


};