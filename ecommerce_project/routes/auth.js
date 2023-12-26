const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));

// Use cookie-session middleware
router.use(cookieSession({
    name: 'session',
    keys: ['raisaheb'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

router.get('/authenticate',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/authenticate/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log("in passworf");
        console.log(req.user);
        req.session.encryptedProfiler = req.encryptedProfiler;
        res.redirect('/protected');
    }
);

// ...

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Passport configuration for Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: '7779876912-3kvhtgovb1j8lqqma7o6d3vb7a6iqstv.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/authenticate/callback'
},
    (accessToken, refreshToken, profile, done) => {
        console.log([accessToken, refreshToken, profile]);

        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32); // Generate a 32-byte key for AES-256
        const iv = crypto.randomBytes(16); // Generate a new random IV for each encryption
        console.log([key, iv]);
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(JSON.stringify(profile), 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        console.log(encrypted);
        return done(null, { 'encryptedProfile': { data: encrypted, key: key.toString('hex'), iv: iv.toString('hex') } });


    }));

// Serialize user to the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});


module.exports = router;
