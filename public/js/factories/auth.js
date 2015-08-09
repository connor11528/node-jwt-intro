// stores and removes jwt and user data
// from browser's local storage 

app.factory('auth', function($window){

	var store = $window.localStorage;
	var key = 'node-jwt-intro-auth-token';
	var userKey = 'node-jwt-intro-user';

	return {
		getToken: function(){
			return store.getItem(key);
		},
		setToken: function(token){
			if(token){
				store.setItem(key, token);
			} else {
				store.removeItem(key);
			}
		},
		getUser: function(){
			return store.getItem(userKey);
		},
		setUser: function(user){
			if(user){
				store.setItem(userKey, JSON.stringify(user));
			} else {
				store.removeItem(userKey);
			}
		}
	};
});

// if the user has logged in add a special header
app.factory('authInterceptor', function(auth){
	return {
		request: function(config){
			var token = auth.getToken();
			if(token){
				// add custom header to every request when user has token
				config.headers = config.headers || {};
				config.headers['x-access-token'] = token;
			}
			return config;
		}
	};
});