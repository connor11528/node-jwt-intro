var bcrypt = require('bcrypt'),
	q = require('q');

// helper function for hashing users' passwords
module.exports = {

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

