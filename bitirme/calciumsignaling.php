<html>
	<head>
	<script src="Scripts/angular.js" type="text/javascript"></script>
	<script src="Scripts/AngularResources.js" type="text/javascript"></script>
	<script src="Scripts/raphael.js" type="text/javascript"></script>
	<script src="Scripts/jquery-1.6.2.min.js" type="text/javascript"></script>
	<script src="Scripts/jquery-ui-1.8.11.min.js" type="text/javascript"></script>
	<script src="JS/appModule.js" type="text/javascript"></script>
	<script src="JS/raphaelCalcium.js" type="text/javascript"></script>
	<script src="JS/appCalcium.js" type="text/javascript"></script>
	</head>
	<body>
		<div style="height: 100px;">
			<h1 style="position:relative; top: 10px;"> Communication via Calcium Signaling in Nanonetworks </h1>
		</div>
		<div ng-app="calciumSignaling">
			<div ng-controller="CalciumSignalingController">
				<span style="position:absolute; left:610px; top:190px">Symbol Duration :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:190px" >{{view.symbolDuration}}</span>
				<input ng-show="view.show" type="number" min="1" max="99" step="1" maxlength="2" style="position:absolute; left:760px; top:190px; width:80px" ng-model="view.symbolDuration" />
				<span style="position:absolute; left:850px; top:190px">sec</span>

				<span id="numberOfMolecules" style="position:absolute; left:610px; top:220px"># IP3 Molecules :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:220px" >{{view.numberOfMolecules}}</span>
				<input ng-show="view.show" type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:220px; width:80px" ng-model="view.numberOfMolecules" />
				<span style="position:absolute; left:850px; top:220px">#</span>
				
				<span id="numberOfMolecules" style="position:absolute; left:610px; top:250px"># Calcium Molecules :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:250px" >{{view.numberOfMoleculesCal}}</span>
				<input ng-show="view.show" type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:250px; width:80px" ng-model="view.numberOfMoleculesCal" />
				<span style="position:absolute; left:850px; top:250px">#</span>
				
				<span style="position:absolute; left:610px; top:280px">Threshold for ER :</span>
				<input type="number" min="20" max="60" step="1" style="position:absolute; left:760px; top:280px; width:80px" ng-model="view.thresholdER" />
				<span style="position:absolute; left:850px; top:280px">%</span>
				
				<span style="position:absolute; left:610px; top:310px">Threshold for Receptor :</span>
				<input type="number" min="10" max="25" step="1" style="position:absolute; left:760px; top:310px; width:80px" ng-model="view.thresholdReceptor" />
				<span style="position:absolute; left:850px; top:310px">%</span>
				
				<span style="position:absolute; left:610px; top:340px">Threshold for Passage :</span>
				<input type="number" min="2" max="7" step="1" style="position:absolute; left:760px; top:340px; width:80px" ng-model="view.thresholdPassage" />
				<span style="position:absolute; left:850px; top:340px">%</span>
				
				<span style="position:absolute; left:610px; top:370px">Viscosity :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:370px" >{{view.viscosity}}</span>
				<input ng-show="view.show" type="number" min="0" max="0.01" step="0.0005" style="position:absolute; left:760px; top:370px; width:80px" ng-model="view.viscosity" />
				<span style="position:absolute; left:850px; top:370px">kg/(s·m)</span>
				
				<span style="position:absolute; left:610px; top:400px">Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:400px" >{{view.moleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.01" max="10" step="0.01" style="position:absolute; left:760px; top:400px; width:80px" ng-model="view.moleculeSize" />
				<span style="position:absolute; left:850px; top:400px">nm</span>
				
				<span style="position:absolute; left:610px; top:430px">Env. Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:430px" >{{view.environmentMoleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="10" step="0.01" style="position:absolute; left:760px; top:430px; width:80px" ng-model="view.environmentMoleculeSize" />
				<span style="position:absolute; left:850px; top:430px">nm</span>
				
				<span style="position:absolute; left:610px; top:460px">Input Stream :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:460px" >{{view.inputStream}}</span>
				<input ng-show="view.show" maxlength="10" style="position:absolute; left:760px; top:460px; width:80px" ng-model="view.inputStream"/>
				
				<span style="position:absolute; left:610px; top:150px" ng-model="view.currentTime">{{view.currentTime}}</span>
				
				<button ng-show="view.showIterate" style="position:absolute; left:610px; width: 80px;" ng-click="iterateSimulation()">Run</button>
				<button ng-show="view.show"style="position:absolute; left:610px; width: 80px;" onClick="validate()" ng-click="init()">Initialize</button>
				<button ng-show="view.notShow" style="position:absolute; left:700px; width: 80px;" ng-click="refresh()">Refresh</button>
			</div>
		</div>
	</body>
</html>