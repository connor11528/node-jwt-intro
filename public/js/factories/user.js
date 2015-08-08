
app.factory('user', function($http, API_URL){
	return {
		login: function(newUser){
			console.log(newUser);
			return $http.post(API_URL + 'login', {
				email: newUser.email,
				password: newUser.password
			});
		}
	};
});