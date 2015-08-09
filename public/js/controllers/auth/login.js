
app.controller('LoginCtrl', function($scope, user){
	$scope.userCreds = {};

	$scope.loginFields = [
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
				placeholder: 'Don\'t tell nobody',
				required: true
			}

		}
	];

	$scope.login = function(userCreds){
		user.login(userCreds).then(function success(res){
			console.log('Success!');
			console.log(res.data);
		}, handleError);
	};

	function handleError(res){
		console.error('Error!');
		console.error(res.data);
	}
});