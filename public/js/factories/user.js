
app.factory('user', function($http, auth, API_URL){
	return {
		login: function(userCreds){
			return $http.post(API_URL + 'users/auth', {
				email: userCreds.email,
				password: userCreds.password
			}).then(function(res){
				console.log(res.data);
				console.log('Token set: ' + res.data.token);
				auth.setToken(res.data.token);
				return res;
			});
		},
		register: function(newUser){
			// create user
			return $http.post(API_URL + 'users', {
				email: newUser.email,
				password: newUser.password
			}).then(function(res){
				// log user in
				console.log(res)
				console.log('Token set: ' + res.data.token);
				auth.setToken(res.data.token);
				return res;
			});
		}
	};
});