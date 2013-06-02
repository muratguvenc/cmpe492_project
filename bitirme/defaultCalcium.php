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
		<div ng-app="calciumSignaling">
			<div ng-controller="CalciumSignalingController">
				<span style="position:absolute; left:610px; top:90px">Symbol Duration :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:90px" >{{view.symbolDuration}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="60" step="0.5" maxlength="2" style="position:absolute; left:760px; top:90px; width:80px" ng-model="view.symbolDuration" />
				<span style="position:absolute; left:850px; top:90px">sec</span>

				<span id="numberOfMolecules" style="position:absolute; left:610px; top:120px">Number Of Molecules :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:120px" >{{view.numberOfMolecules}}</span>
				<input ng-show="view.show" type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:120px; width:80px" ng-model="view.numberOfMolecules" />
				<span style="position:absolute; left:850px; top:120px">#</span>
				<!--
				<span style="position:absolute; left:610px; top:150px">Dist. Betw. Two Cells :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:150px" >{{view.distanceBetweenTwoCells}}</span>
				<input ng-show="view.show" type="number" min="1" max="50" step="1" style="position:absolute; left:760px; top:150px; width:80px" ng-model="view.distanceBetweenTwoCells" />
				<span style="position:absolute; left:850px; top:150px">µm</span>
				
				<span style="position:absolute; left:610px; top:180px">Radius of a Cell :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:180px" >{{view.cellRadius}}</span>
				<input ng-show="view.show" type="number" min="1" max="20" step="1" style="position:absolute; left:760px; top:180px; width:80px" ng-model="view.cellRadius" />
				<span style="position:absolute; left:850px; top:180px">µm</span>
				
				<span style="position:absolute; left:610px; top:210px">Temperature :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:210px" >{{view.temperature}}</span>
				<input ng-show="view.show" type="number" min="1" max="320" step="0.5" style="position:absolute; left:760px; top:210px; width:80px" ng-model="view.temperature" />
				<span style="position:absolute; left:850px; top:210px">K</span>
				
				<span style="position:absolute; left:610px; top:240px">Viscosity :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:240px" >{{view.viscosity}}</span>
				<input ng-show="view.show" type="number" min="0" max="0.01" step="0.0005" style="position:absolute; left:760px; top:240px; width:80px" ng-model="view.viscosity" />
				<span style="position:absolute; left:850px; top:240px">kg/(s·m)</span>
				
				<span style="position:absolute; left:610px; top:270px">Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:270px" >{{view.moleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.01" max="10" step="0.01" style="position:absolute; left:760px; top:270px; width:80px" ng-model="view.moleculeSize" />
				<span style="position:absolute; left:850px; top:270px">nm</span>
				
				<span style="position:absolute; left:610px; top:300px">Env. Molecule Size :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:300px" >{{view.environmentMoleculeSize}}</span>
				<input ng-show="view.show" type="number" min="0.5" max="10" step="0.01" style="position:absolute; left:760px; top:300px; width:80px" ng-model="view.environmentMoleculeSize" />
				<span style="position:absolute; left:850px; top:300px">nm</span>-->
				
				<span style="position:absolute; left:610px; top:330px">Input Stream :</span>
				<span ng-show="view.notShow" style="position:absolute; left:765px; top:330px" >{{view.inputStream}}</span>
				<input ng-show="view.show" maxlength="10" style="position:absolute; left:760px; top:330px; width:80px" ng-model="view.inputStream"/>
				
				<span style="position:absolute; left:610px; top:360px">Threshold Percentage :</span>
				<input type="number" min="1" max="100" step="1" style="position:absolute; left:760px; top:360px; width:80px" ng-model="view.threshold"/>
				<span style="position:absolute; left:850px; top:360px">%</span>
				
				<span style="position:absolute; left:610px; top:50px" ng-model="view.currentTime">{{view.currentTime}}</span>
				
				<button ng-show="view.showIterate" style="position:absolute; left:610px; width: 80px;" ng-click="iterateSimulation()">ilerle</button>
				<button ng-show="view.show"style="position:absolute; left:610px; width: 80px;" onClick="validate()" ng-click="init()">init</button>
				<button ng-show="view.notShow" style="position:absolute; left:700px; width: 80px;" ng-click="refresh()">yenile</button>
			</div>
		</div>
	</body>
</html>