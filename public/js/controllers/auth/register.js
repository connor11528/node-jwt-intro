
app.controller('RegisterCtrl', function($rootScope, $scope, user, $state){
	$scope.newUser = {};

	$scope.registerFields = [
		{ 
			type: 'input',
			key: 'email',
			templateOptions: {
				label: 'Email',
				type: 'email',
				placeholder: 'Valid email address',
				required: true
			}
		},
		{ 
			type: 'input',
			key: 'password',
			templateOptions: {
				label: 'Password',
				type: 'password',
				placeholder: '8 characters, number and special symbol',
				required: true
			},
			validators: {
				checker: function($viewValue, $modelValue, scope){
					var attemptedPwd = $viewValue || $modelValue;

					var REQUIRED_PATTERNS = [
					    /\d+/,    //numeric values
					    /[a-z]+/, //lowercase values
					    /[A-Z]+/, //uppercase values
					    /\W+/,    //special characters
					    /^\S+$/   //no whitespace allowed
					];
					var status = true;
					angular.forEach(REQUIRED_PATTERNS, function(pattern) {
						// check that the attempted password passes all tests
						status = status && pattern.test(attemptedPwd);
					});

					// must be at least eight characters
					return (status && attemptedPwd.length >= 8)? true : false;
				}

			}
		}
	];

	$scope.register = function(newUser){
		user.register(newUser).then(function success(res){
			if(res.data.success){
				$rootScope.user = res.data.user;
				$state.go('home');
			}
		}, handleError);
	};

	function handleError(res){
		alert('Error: ' + res.data);
	}
});