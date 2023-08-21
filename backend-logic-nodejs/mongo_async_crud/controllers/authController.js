const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// refresh tokens are stored in HttpOnly cookies
// access tokens are sent to client as JSON

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.status(401).json({"message": "User with that username not found in database"}); //Unauthorized 
    
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean); //eliminate nulls in the values

        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '20s' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //secure: true

        // Send authorization roles and access token to user
        res.json({ roles, accessToken });

    } else {
        res.status(401).json({"message": "Password incorrect"});
    }

    console.log(foundUser);
}

module.exports = { handleLogin };