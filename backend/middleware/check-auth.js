const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authentication failed');
        }

        const token = authHeader.split(' ')[1]; // Extract token
        if (!token) {
            throw new Error('Authentication failed');
        }

        const decodedToken = jwt.verify(token, 'supersecret_dont_share'); // Verify token
        req.userData = { userId: decodedToken.userId }; // Attach user data
        next();
    } catch (error) {
        return next(new HttpError('Authentication failed', 403));
    }
};
