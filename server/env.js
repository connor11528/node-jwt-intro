var path = require('path'),
	rootPath = path.normalize(__dirname + '/../../');
	
module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://localhost/node-jwt-intro',
		port: process.env.PORT || 3000
	},
	production: {
		rootPath: rootPath,
		db: process.env.MONGOLAB_URI || 'mongodb://heroku_v69r5s4p:q2bethh9shan24v6ov2q111fnm@ds031893.mongolab.com:31893/heroku_v69r5s4p',
		port: process.env.PORT || 80
	}
};