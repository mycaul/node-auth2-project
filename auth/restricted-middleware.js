const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

module,exports = (req, res, next) => {
    const token = req.headers.authorization;
    const secrets = secrets.jwtSecret;

    if (token) {
        jwt.verify(token, secret, (error, decodedToken) => {
            if (error) {
                res.status(401).json(`Sorry, Not Happening!`)
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({ message: 'Please provide correct credentials' })
        console.log(token);
        console.log(req.headers)
    }
};