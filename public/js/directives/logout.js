
app.directive('logout', function(){
	return {
		restrict: 'A',
		replace: true,
		controller: 'LoginCtrl',
		template: '<div class="btn btn-primary" ng-click="logout()">Logout</div>'
	}
});