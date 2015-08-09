
app.controller('RegisterCtrl', function($scope, user){
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
			}

		}
	];

	$scope.login = function(newUser){
		user.login(newUser).then(function success(res){
			// user has logged in, haz their data
		}, handleError);
	};

	function handleError(res){
		alert('Error: ' + res.data);
	}
});