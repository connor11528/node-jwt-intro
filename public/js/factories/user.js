
app.factory('user', function($http, auth, API_URL){
	return {
		login: function(newUser){
			return $http.post(API_URL + 'users/auth', {
				email: newUser.email,
				password: newUser.password
			}).then(function(res){
				console.log(res)
				console.log('Token set: ' + res.data.token);
				auth.setToken(res.data.token);
				return res;
			});
		}
	};
});