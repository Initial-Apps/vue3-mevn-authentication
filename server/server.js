const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session  = require('express-session'); // Authentication is stored in sessions, so we'll use express-session
const MongoStore = require('connect-mongo');  // Used to connect our session data to our MongoDB
const passport = require('passport'); // Passport is used for authentication

const app = express()
const port = 3000
require('dotenv').config(); 

// Connect to our MONGOOSE DB
const connectString = process.env.MONGODB;  
mongoose.connect(connectString, { useNewUrlParser: true }).then(
  () => { 
    console.log ('Succeeded connected to database');
   },
  err => { 
    console.log ('ERROR connecting to database: ' + err);
   }
);

// Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);
// Create the Session
app.use(session({
	secret: process.env.SESSION_SK,
	resave: true,
	saveUninitialized: false,
	cookie: {
    	httpOnly: false,
		sameSite: true,
		maxAge: 4 * 60 * 60 * 1000,
	},
	store: MongoStore.create({
		mongoUrl: connectString,
		ttl: 4 * 60 * 60, // logout after 1hr
	})
}));
app.use(passport.initialize()); // initialize passport login sessions
app.use(passport.session()); // for persistent login sessions


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api', (req, res) => {
  console.log(req.body)
  res.status(200).json({ result: req.body.text });
})

app.post('/api/login', (req, res, next) => {
	// general flow, 1) calls passport/login, 2) this function, 3) serializes in passport/init 4) deserializes in passport/init
	passport.authenticate('login', function(err, user, info) {
		if (err) {
			console.log('err');
			return res.sendStatus(400);
		}
		if (!user) {
			console.log('no user');
			return res.sendStatus(400);
		}		
		req.logIn(user, function(err) {
			if (err) { return next(err); } else {
				// return
				return res.sendStatus(200);					
			}
		});
	})(req, res, next);
});

/*** POST SIGNUP A USER ***/
app.post('/api/signup', (req, res, next) => {
	passport.authenticate('signup', registerUser)(req, res, next);
	function registerUser(err, user, info) {
		if (err) { console.log(err); return res.send(err) }
		if (!user) {
			return res.status(400).json(info);
		}
		if (user){
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				// return
				return res.sendStatus(200);
			});
		}
	}
});

/*** LOGOUT A USER ***/
app.post('/signout', (req, res, next) => {
	req.logout(function(err) {
		if (err) { console.log(err) }
	});
	res.clearCookie('connect.sid');
	res.send('logout');
	console.log('logged out');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})