const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { finalUser, pwd, agency } = req.body;
    console.log(finalUser, pwd);
    if (!finalUser || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: finalUser }).exec();
    if (duplicate) return res.status(409).json({'message': 'User already exists in the database'}); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "username": finalUser,
            "password": hashedPwd,
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${finalUser} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };