<html>
	<head>
	<script src="Scripts/angular.js" type="text/javascript"></script>
	<script src="Scripts/AngularResources.js" type="text/javascript"></script>
	<script src="Scripts/raphael.js" type="text/javascript"></script>
	<script src="Scripts/jquery-1.6.2.min.js" type="text/javascript"></script>
	<script src="Scripts/jquery-ui-1.8.11.min.js" type="text/javascript"></script>
	<script src="JS/appModule.js" type="text/javascript"></script>
	<script src="JS/raphael.js" type="text/javascript"></script>
	<script src="JS/app.js" type="text/javascript"></script>
	</head>
	<body>
		<div style="height: 100px;">
			<h1 style="position:relative; top: 10px;"> Communication via Diffusion in Nanonetworks </h1>
		</div>
		<div ng-app="diffusion">
			<div ng-controller="DiffusionController">
				<span style="position:absolute; left:610px; top:190px">Symbol Duration :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:190px" >{{view.symbolDuration}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="15" step="0.5" maxlength="2" style="position:absolute; left:760px; top:190px; width:80px" ng-model="view.symbolDuration" />
				<span style="position:absolute; left:850px; top:190px">sec</span>

				<span id="numberOfMolecules" style="position:absolute; left:610px; top:220px">Number Of Molecules :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:220px" >{{view.numberOfMolecules}}</span>
				<input ng-show="view.show" type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:220px; width:80px" ng-model="view.numberOfMolecules" />
				<span style="position:absolute; left:850px; top:220px">#</span>
				
				<span style="position:absolute; left:610px; top:250px">Dist. Betw. Two Cells :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:250px" >{{view.distanceBetweenTwoCells}}</span>
				<input ng-show="view.show" type="number" min="1" max="50" step="1" style="position:absolute; left:760px; top:250px; width:80px" ng-model="view.distanceBetweenTwoCells" />
				<span style="position:absolute; left:850px; top:250px">µm</span>
				
				<span style="position:absolute; left:610px; top:280px">Radius of a Cell :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:280px" >{{view.cellRadius}}</span>
				<input ng-show="view.show" type="number" min="1" max="20" step="1" style="position:absolute; left:760px; top:280px; width:80px" ng-model="view.cellRadius" />
				<span style="position:absolute; left:850px; top:280px">µm</span>
				
				<span style="position:absolute; left:610px; top:310px">Temperature :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:310px" >{{view.temperature}}</span>
				<input ng-show="view.show" type="number" min="1" max="320" step="0.5" style="position:absolute; left:760px; top:310px; width:80px" ng-model="view.temperature" />
				<span style="position:absolute; left:850px; top:310px">K</span>
				
				<span style="position:absolute; left:610px; top:340px">Viscosity :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:340px" >{{view.viscosity}}</span>
				<input ng-show="view.show" type="number" min="0" max="0.01" step="0.0005" style="position:absolute; left:760px; top:340px; width:80px" ng-model="view.viscosity" />
				<span style="position:absolute; left:850px; top:340px">kg/(s·m)</span>
				
				<span style="position:absolute; left:610px; top:370px">Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:370px" >{{view.moleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="10" step="0.01" style="position:absolute; left:760px; top:370px; width:80px" ng-model="view.moleculeSize" />
				<span style="position:absolute; left:850px; top:370px">nm</span>
				
				<span style="position:absolute; left:610px; top:400px">Env. Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:400px" >{{view.environmentMoleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="10" step="0.01" style="position:absolute; left:760px; top:400px; width:80px" ng-model="view.environmentMoleculeSize" />
				<span style="position:absolute; left:850px; top:400px">nm</span>
				
				<span style="position:absolute; left:610px; top:430px">Input Stream :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:430px" >{{view.inputStream}}</span>
				<input ng-show="view.show" maxlength="10" style="position:absolute; left:760px; top:430px; width:80px" ng-model="view.inputStream"/>
				
				<span style="position:absolute; left:610px; top:460px">Threshold Percentage :</span>
				<input type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:460px; width:80px" ng-model="view.threshold"/>
				<span style="position:absolute; left:850px; top:460px">%</span>
				
				<span style="position:absolute; left:610px; top:150px" ng-model="view.currentTime">{{view.currentTime}}</span>
				
				<button ng-show="view.showIterate" style="position:absolute; left:610px; width: 80px;" ng-click="iterateSimulation()">Run</button>
				<button ng-show="view.show"style="position:absolute; left:610px; width: 80px;" onClick="validate()" ng-click="init()">Initialize</button>
				<button ng-show="view.notShow" style="position:absolute; left:700px; width: 80px;" ng-click="refresh()">Refresh</button>
			</div>
		</div>
	</body>
</html>