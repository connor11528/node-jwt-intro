// stores and removes the jwt auth token 
// from browser's local storage 

app.factory('auth', function($window){

	var store = $window.localStorage;
	var key = 'auth-token';

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
		}
	};
});

app.factory('authInterceptor', function(){
	return
})