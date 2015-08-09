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

