const jwt = require('jsonwebtoken');


// client sends access token in Authorization header
// Authorization: Bearer <access_token>

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const refreshToken = req.cookies.jwt;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ "message": "Unauthorized access" });
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT