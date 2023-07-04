const LocalStrategy = require('../node_modules/passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	// LOCAL AUTHORIZATION STRATEGY
	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {
		findOrCreateUser = function(){
			// find a user in Mongo with provided username
			User.findOne({ 'email' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err);
				}
				// If already exists
				if (user) {
					console.log('User already exists with email: '+username);
					return done(null, false, 'That Email Already Exists');
				} else {
					// Hash the password
					const hash = createHash(password);
					// If there is no user with that email
					// create the user
					let newUser = new User({
						_id: new mongoose.Types.ObjectId(),
						email: username,
						password: hash,
					});	
					// save the user
					newUser.save(function(err){
						if (err){
							console.log('Error in Saving user: '+err);
							throw err;
						}
						console.log('User Registration succesful');
						return done(null, newAccount);
					});
				}
			});
		};
		// Delay the execution of findOrCreateUser and execute the method
		// in the next tick of the event loop
		process.nextTick(findOrCreateUser);
	}));
	// Generates hash using bCrypt
	const createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}