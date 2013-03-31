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
				<span style="position:absolute; left:600px; top:90px">Number Of Molecules :</span>
				<span style="position:absolute; left:755px; top:90px" >{{view.numberOfMolecules}}</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:90px" ng-model="view.numberOfMolecules" />
				
				<span style="position:absolute; left:600px; top:130px">Dist. Betw. Two Cells :</span>
				<span style="position:absolute; left:755px; top:130px" >{{view.distanceBetweenTwoCells}} µm</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:130px" ng-model="view.distanceBetweenTwoCells" />
				
				<span style="position:absolute; left:600px; top:170px">Radius of a Cell :</span>
				<span style="position:absolute; left:755px; top:170px" >{{view.cellRadius}} µm</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:170px" ng-model="view.cellRadius" />
				
				<span style="position:absolute; left:600px; top:210px">Temperature :</span>
				<span style="position:absolute; left:755px; top:210px" >{{view.temperature}} K</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:210px" ng-model="view.temperature" />
				
				<span style="position:absolute; left:600px; top:250px">Viscosity :</span>
				<span style="position:absolute; left:755px; top:250px" >{{view.viscosity}}</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:250px" ng-model="view.viscosity" />
				
				<span style="position:absolute; left:600px; top:290px">Molecule Size :</span>
				<span style="position:absolute; left:755px; top:290px" >{{view.moleculeSize}} nm</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:290px" ng-model="view.moleculeSize" />
				
				<span style="position:absolute; left:600px; top:330px">Input Stream :</span>
				<span style="position:absolute; left:755px; top:330px" >{{view.inputStream}}</span>
				<input ng-show="view.show" style="position:absolute; left:750px; top:330px" ng-model="view.inputStream"/>
				
				<span style="position:absolute; left:600px; top:370px">Output Stream :</span>
				<span style="position:absolute; left:755px; top:370px" >{{view.outputStream}}</span>
				
				<span style="position:absolute; left:600px; top:410px">Threshold Percentage :</span>
				<input style="position:absolute; left:750px; top:410px" ng-model="view.threshold"/>
				
				<span style="position:absolute; left:600px; top:50px" ng-model="view.currentTime">{{view.currentTime}}</span>
				
				<button style="position:absolute; left:600px;" ng-click="iterateSimulation()">ilerle</button>
				<button style="position:absolute; left:650px;" ng-click="init()">init</button>
				<button style="position:absolute; left:700px;" ng-click="refresh()">yenile</button>
			</div>
		</div>
	</body>
</html>