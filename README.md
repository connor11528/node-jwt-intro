node-jwt-intro
=====

> An express.js server with mongodb and mongoose ORM. This repo uses angular.js and the browser's localStorage to create a secure, persistent authentication application

[DEMO](https://node-jwt-intro.herokuapp.com/#/)

[TUTORIAL markdown file (pasted in below)](https://github.com/connor11528/cleechtech-blog/blob/master/source/_posts/use-express-angular-and-jwt-to-make-a-secure-app.md)

Usage

* angular-formly
* angular ui router abstract states
* mongodb with mongoose
* password hashing with [node.bcrypt](https://github.com/ncb000gt/node.bcrypt.js)
* jwt token authentication

Relied heavily on the [egghead course](https://egghead.io/series/angularjs-authentication-with-jwt) and the [scotch.io tutorial](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)

#### Getting started
```
$ git clone <this_repo>
$ npm install
$ nodemon server 
```

### Deployment

```sh
heroku create <app_name>
heroku config:set NODE_ENV=production
heroku addons:create mongolab:sandbox 
heroku config | grep MONGOLAB_URI
git push heroku master
heroku ps:scale web=1
```

### Tutorial
=======================================================
# use express, angular and jwt to make a secure app 

![](http://media.giphy.com/media/3oEduWAFQjlfP5gMU0/giphy.gif)

> Master authentication with fullstack javascript development

This tutorial builds the code in this repo from scratch.

### Build server
```
$ git clone https://github.com/connor11528/mean-starter
```
mean-starter is the template I use for base MEAN stack apps. When you're done we will have a starter template with authentication that you can use for all projects. I also have [connor11528/mean-auth-starter](https://github.com/connor11528/mean-auth-starter), which is very similar to this repo.

Install some more packages:

```
$ npm install jsonwebtoken bcrypt q --save
```

In **server.js** add a secret key. We will use the secret key to encrypt and decrypt the Json Web Tokens (JWTs).

```
// JWT config
var jwtSecret = 'thupers3crT$12';
app.set('superSecret', jwtSecret);
```

Create a user schema in **server/models/user.js**:

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// email, pwd are required
// email must be unique
// don't send password with requests

var userSchema = new Schema({
	email: {type: String, required: true, unique: true },
	password: {type: String, required: true, select: false },
	admin: Boolean
});

module.exports = mongoose.model('User', userSchema);
```

Like the comments say, email and passwords are required, emails must be unique and don't send the password with the request. We are going to hash user passwords but it is still good practice to not expose that.

*Hash password:* we are going to have a util for hashing and decrypting passwords. We will have these methods in **server/utils.js**:

```
var bcrypt = require('bcrypt'),
	q = require('q');

// helper function for hashing users' passwords
module.exports = {
	comparePwd: function(password, hash){
		var dfd = q.defer();

		bcrypt.compare(password, hash, function(err, isMatch){
			if(err) dfd.reject(err);

			dfd.resolve(isMatch);
		});

		return dfd.promise;
	},
	hashPwd: function(password){
		var dfd = q.defer();
		bcrypt.genSalt(10, function(err, salt) {
			if(err) dfd.reject(err);

		    bcrypt.hash(password, salt, function(err, hash) {
		    	if(err) dfd.reject(err);

		    	dfd.resolve(hash);
		    });
		});

		return dfd.promise;
	}
};
```


set up routes in **server/routes.js**:

```
var express = require('express'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	utils = require('./utils'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	User = require('./models/user'),
	router = express.Router();

module.exports = function(app){	
    ...
```

Then make an api endpoint to add a user:

```
// add user
	apiRouter.post('/users', function(req, res){

		utils.hashPwd(req.body.password).then(function(hashedPwd){

			var newUser = new User({
				email: req.body.email,
				password: hashedPwd,
				admin: false
			});

			newUser.save(function(err){
				if(err) throw err;

				// create token
				var token = jwt.sign(newUser, app.get('superSecret'), { expiresInminutes: 1440 });

				newUser.password = undefined;

				// send token
				res.json({
					success: true,
					message: 'Successfully authenticated!',
					token: token,
					user: newUser
				});
			});
		});
		
	});
```

We create the user in the database, create a token and send that. Authenticate a user with this route:

```
	// authenticate user
	apiRouter.post('/users/auth', function(req, res){

		// add back the password field for this query
		var query = User.findOne({
			email: req.body.email
		}).select('_id email +password');

		query.exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.json({ success: false, message: 'No user with that email' });
			} else if(user){

				// check password
				utils.comparePwd(req.body.password, user.password).then(function(isMatch){
					if(!isMatch){
						res.json({ success: false, message: 'Wrong password' });
					} else {

						// create token
						var token = jwt.sign(user, app.get('superSecret'), { expiresInminutes: 1440 });

						user.password = undefined;

						// send token
						res.json({
							success: true,
							message: 'Successfully authenticated!',
							token: token,
							user: user
						});
					}
				});
			}
		});
	});
```

Then we're going to have an endpoint to show all the users, but we are going to protect it with some middleware, namely an `authenticate` function.

```
apiRouter.get('/users', authenticate, function(req, res){
		User.find({}, function(err, users){
			res.json(users);
		});
	});
```

That function is defined as such:

```
// middleware
	function authenticate(req, res, next){
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  if (token) {

	  	// verify token validity
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        req.decoded = decoded;    
	        next();
	      }
	    });

	  } else {

	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }
	}
```

That's all the server setup. Next we will deploy the app to heroku.


### Deploy to heroku

```
$ heroku create <app_name>
$ heroku config:set NODE_ENV=production
$ heroku addons:create mongolab:sandbox 
$ heroku config | grep MONGOLAB_URI
```
Add the mongolab uri to **server/env.js**. Then commit the change.
```
$ git push heroku master
$ heroku ps:scale web=1
```

### Build client 

Include libraries in **public/index.html**. We are going to use [angular-formly](https://github.com/formly-js/angular-formly) to keep things fresh. It also means we write more javascript and less html. woohoo!

```
<!-- angular + router + bootstrap -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.js"></script>
  
  <!-- angular-formly + dependency -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/api-check/7.5.0/api-check.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-formly/6.21.1/formly.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-formly-templates-bootstrap/6.0.0/angular-formly-templates-bootstrap.js"></script>

<!-- our custom js -->
...
```

![](http://media.giphy.com/media/QgpbrXUVhJqzm/giphy.gif)

Here is the module definition in **public/js/app.js**:

```

var app = angular.module('jwtintro', [
	'ui.router',
	'formly',
	'formlyBootstrap'
], function($httpProvider){
	// will add token to header of requests if token is present
	$httpProvider.interceptors.push('authInterceptor');
});

app.run(function($rootScope, auth){
	// if the user's data is in local storage
	// show them as signed in
	var user = auth.getUser();

	if(user){
		$rootScope.user = JSON.parse(user);
	}
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
```

Bet you did not know that there is a third argument to module definitions. I did not. You like that nifty abstract state? Shit is cray. Alright moving on, controllers look like:

```

app.controller('LoginCtrl', function($rootScope, $scope, user, $state){
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
				placeholder: 'Password',
				required: true
			}

		}
	];

	$scope.login = function(userCreds){
		user.login(userCreds).then(function success(res){
			// if successful, log user in
			if(res.data.success){
				$rootScope.user = res.data.user;
				$state.go('home');
			}	
		}, function handleError(res){
			console.error('Error: ' + JSON.stringify(res.data));
		});
	};

	$scope.logout = function(){
		$rootScope.user = null;
		user.logout();

		// hard page refresh
		$state.go($state.current.name, $state.params, { reload: true });
	};

});


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
```

**public/js/factories/auth.js**:
Here we are going to store the user data and the token in the browser's localStorage. We also define this funky httpInterceptor business. request is a special keyword. It acts similar to express middleware.
```
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
```

In the user facory we will send requests for login, logout and register **public/js/factories/user.js**:

```

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
```
Now for the templates. Here's the abstract one in **public/templates/auth/main.html**:

```
<div class='text-center'>
	<div class="btn-group btn-group-justified" role="group">
      <a ui-sref="auth.login" ui-sref-active='active' class="btn btn-default" role="button">Login</a>
      <a ui-sref="auth.register" ui-sref-active='active' class="btn btn-default" role="button">Register</a>
    </div>

    <div class='col-sm-6 col-sm-offset-3'>
		<div ui-view></div>
	</div>
</div>
```

and then the login and register angular-formly layouts are minimal.

```
<h3>Sign in</h3>
<form name='loginForm' ng-submit='login(userCreds)' novalidate>
	<formly-form model='userCreds' fields='loginFields' form='loginForm'>
		<button type='submit' class='btn btn-primary' ng-disabled="loginForm.$invalid">Login</button>
	</formly-form>
</form>
```

and...

```
<h3>Create a new account</h3>
<form name='registerForm' ng-submit='register(newUser)' novalidate>
	<formly-form model='newUser' fields='registerFields' form='registerForm'>
		<button type='submit' class='btn btn-success' ng-disabled="registerForm.$invalid">Register</button>
	</formly-form>
</form>
```

That is pretty much it. It is worth noting any app can send these requests to this server. The server sends and validates tokens. The server does not need to maintain sessions. The browser's localStorage is also really helpful with this examples. If you have questions [hit me up on twitter](https://twitter.com/connor11528).
