
var app = angular.module('jwtintro', [
	'ui.router',
	'formly',
	'formlyBootstrap'
], function($httpProvider){
	
});

app.constant('API_URL', 'api/');

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "templates/main.html",
			controller: 'MainCtrl'
		})
		.state('auth', {
			abstract: true,
			templateUrl: 'templates/auth/main.html'
		})
		.state('auth.login', {
			url: "/login",
			templateUrl: "templates/auth/login.html",
			controller: 'LoginCtrl'
		})
		.state('auth.register', {
			url: "/register",
			templateUrl: "templates/auth/register.html",
			controller: 'RegisterCtrl'
		});

	$urlRouterProvider.otherwise("/");
});