require('dotenv').config();
// default middleware
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// for whitelist and cors-related options
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
// for authorization
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
// for mongoDB
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get('/working', (req, res) => {
    res.send('Hello World!')
})


// routes, dont need to have verifyJWT and verifyRoles
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));





// routes, need to have verifyJWT and verifyRoles
app.use('/image', require('./routes/image'));
app.use('/users', verifyJWT, require('./routes/api/users'));





app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});