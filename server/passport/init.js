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
		User.findById(userSession._id)
		.then((user)=>{
			console.log('deserializingUser');
			done(null, user)
		})
		.catch((err)=>{
			console.log(err);
			done(err)
		})
	});
	login(passport);
	signup(passport);
}