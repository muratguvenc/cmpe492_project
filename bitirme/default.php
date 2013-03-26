<html>
	<script src="Scripts/angular.js" type="text/javascript"></script>
	<script src="Scripts/AngularResources.js" type="text/javascript"></script>
	<script src="Scripts/raphael.js" type="text/javascript"></script>
	<script src="Scripts/jquery-1.6.2.min.js" type="text/javascript"></script>
	<script src="Scripts/jquery-ui-1.8.11.min.js" type="text/javascript"></script>
	<script src="JS/directives.js" type="text/javascript"></script>
	<script src="JS/appModule.js" type="text/javascript"></script>
	<script src="JS/raphael.js" type="text/javascript"></script>
	<script src="JS/app.js" type="text/javascript"></script>
	<body>
		<div ng-app="diffusion">
			<div ng-controller="DiffusionController">
				<span ng-show="view.show" style="position:absolute; left:600px; top:90px">Number Of Molecules :</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:90px" ng-model="view.numberOfMolecules" />
				<span ng-show="view.show" style="position:absolute; left:600px; top:130px">Dist. Betw. Two Cells :</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:130px" ng-model="view.distanceBetweenTwoCells" />
				<span ng-show="view.show" style="position:absolute; left:600px; top:170px">Temperature :</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:170px" ng-model="view.temperature" />
				<span ng-show="view.show" style="position:absolute; left:600px; top:210px">Viscosity :</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:210px" ng-model="view.viscosity" />
				<span ng-show="view.show" style="position:absolute; left:600px; top:250px">Molecule Size :</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:250px" ng-model="view.moleculeSize" />
				
				<span style="position:absolute; left:600px; top:50px" ng-model="view.currentTime">{{view.currentTime}}</span>
				
				<button style="position:absolute; left:600px;" ng-click="iterateSimulation()">ilerle</button>
				<button style="position:absolute; left:650px;" ng-click="init()">init</button>
				<button style="position:absolute; left:700px;" ng-click="refresh()">yenile</button>
			</div>
		</div>
	</body>
</html>