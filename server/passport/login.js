const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		username = username.toLowerCase(); // clear caps
		User.findOne({email: username}, function(err, user){
			if(err) return done(err);
			if(!user) {
				console.log('User Not Found with username '+username);
				return done(null, false, 'Invalid Username');
			}
			// User exists but no password, log the error
			if (user && !user.password){
				console.log('No Password');
				return done(null, false, 'No Password'); // redirect back to login page
			}
			// User exists but wrong password, log the error
			if (!isValidPassword(user, password)){
				console.log('Invalid Password');
				return done(null, false, 'Invalid Password'); // redirect back to login page
			}
			if(isValidPassword(user, password)){
                return done(null, user);
			}
		})
	}));
	const isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	}
}