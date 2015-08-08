
var app = angular.module('jwtintro', [
	'ui.router',
	'formly',
	'formlyBootstrap'
]);

app.constant('API_URL', 'api/');

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "templates/main.html",
			controller: 'MainCtrl'
		})
		.state('login', {
			url: "/login",
			templateUrl: "templates/login.html",
			controller: 'LoginCtrl'
		});

	$urlRouterProvider.otherwise("/");
});