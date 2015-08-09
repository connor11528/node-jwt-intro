
app.factory('user', function($http, auth, API_URL){
	return {
		login: function(userCreds){
			return $http.post(API_URL + 'users/auth', {
				email: userCreds.email,
				password: userCreds.password
			}).then(function(res){
				auth.setToken(res.data.token);
				auth.setUser(res.data.user);
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
				auth.setToken(res.data.token);
				auth.setUser(res.data.user);
				return res;
			});
		},
		logout: function(){
			auth.setToken();
			auth.setUser();
		}
	};
});