// mongoose.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userStorage = require('./userStorage');

const User = require('./models/User'); // Update with your actual user model

router.use((req, res, next) => {
    // Extract the token from the session or headers (adjust as needed)
    const token = req.session.token || req.headers.authorization;

    if (token) {
        // Verify the token
        jwt.verify(token, 'your-secret-key', (err, decoded) => {
            if (err) {
                // Token verification failed
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Token is valid
            req.decoded = decoded;
            next();
        });
    } else {
        // No token provided
        return res.status(403).json({ message: 'Forbidden' });
    }
});

router.use(async (req, res, next) => {
    try {
        // Check if the user exists
        let user = await User.findById(req.decoded.userId);

        if (!user) {
            // Create a user if not present
            user = new User({
                // Add user properties based on your model
                username: req.decoded.email,
                email: req.decoded.email,
            });

            await user.save();
        }

        // Store the user in the request for further use
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/home', (req, res) => {
    // Access the authenticated user through req.user
    res.send(`Welcome, ${req.user.username}!`);
});

module.exports = router;
