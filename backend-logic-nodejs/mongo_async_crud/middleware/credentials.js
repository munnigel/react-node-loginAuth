const allowedOrigins = require('../config/allowedOrigins');

// Handle options credentials check - before CORS! This is to allow credentials for whitelisted origins
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials