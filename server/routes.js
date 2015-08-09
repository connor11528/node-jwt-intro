var express = require('express'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	utils = require('./utils'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	User = require('./models/user'),
	router = express.Router();

module.exports = function(app){	
	// Users
	// all users
	apiRouter.get('/users', authenticated, function(req, res){
		User.find({}, function(err, users){
			res.json(users);
		});
	});

	// TODO
	// middleware to check the user is authenticated
	function authenticated(req, res, next){
		next();
	}

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
				var token = jwt.sign({ email: newUser.email }, app.get('superSecret'), { expiresInminutes: 1440 });

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

	// authenticate user
	apiRouter.post('/users/auth', function(req, res){

		User.findOne({
			email: req.body.email
		}, function(err, user){
			if(err) throw err;

			console.log(user);

			if(!user){
				res.json({ success: false, message: 'No user with that email' });
			} else if(user){
				// check password
				utils.comparePwd(req.body.password, user.password).then(function(isMatch){
					if(!isMatch){
						res.json({ success: false, message: 'Wrong password' });
					} else {
						// create token
						var token = jwt.sign({ email: user.email }, app.get('superSecret'), { expiresInminutes: 1440 });

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

	// angularjs catch all route
	router.get('/*', function(req, res) {
		res.sendFile(rootPath + 'public/index.html', { user: req.user });
	});

	app.use('/api', apiRouter);
	app.use('/', router);
};