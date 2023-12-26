const cookieSession = require("cookie-session");
const crypto = require('crypto');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const decodeTokenMiddleware = (req, res, next) => {
    // Check if the session contains a token
    const token = req.session;
    console.log(req.session);
    console.log('as');

    if (token) {
        // Verify the token
        const algorithm = 'aes-256-cbc';
        console.log(req.session.passport.user.encryptedProfile);
        const { data, key, iv } = req.session.passport.user.encryptedProfile;
        const decodedKey = Buffer.from(key, 'hex');
        const decodedIV = Buffer.from(iv, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, decodedKey, decodedIV);

        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        decrypted = JSON.parse(decrypted);
        if (decrypted.id === '117331122666007608717') {
            res.send('user is authorized....');
        }
    } else {
        // No token found in the session
        res.status(401).send('Unauthorized');
    }
};
module.exports = decodeTokenMiddleware;