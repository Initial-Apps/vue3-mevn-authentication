const login = require('./login');
const signup = require('./signup');
const User = require('../models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
		done(null, { 
			_id: user._id,
		});
	});
	passport.deserializeUser(function(userSession, done) {	
		User.findById(userSession._id).
		exec(function (err, user) {
			if(err){
				console.log(err);
			}
		    if(user){
				console.log('deserializingUser');
			}
			done(err, user);
		});
	});
	login(passport);
	signup(passport);
}