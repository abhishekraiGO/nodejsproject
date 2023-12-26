
//importing express
const express = require('express');
//creating app
const app = express();
const path = require('path');
const router = require('../routes/auth');
const autheticate = require('../controllers/authentication');
const cookieSession = require('cookie-session'); // Import the cookie-session middleware

// Use cookie-session middleware for the entire app
app.use(cookieSession({
    name: 'session',
    keys: ['raisaheb'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/your-database-name', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//creating server
// const authRoutes = require('./routes/auth.js');
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`server started at port ${port}`);
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './../', 'views/login.html'), (error) => {
        console.log(error);
    })
});





// Apply the middleware to the protected route
app.get('/protected', autheticate, (req, res) => {
    console.log('asdsadasdsa');

    // Access the decoded token from the request object
    const decodedToken = req.decodedToken;

    // Do something with the decoded token
    console.log(decodedToken);

    res.send('Protected route');
});
app.use('/auth', router);

// app.get('/register', (req, res) => {
//     res.sendFile('./views/register.html', (error) => {
//         console.log(error);
//     });
// })
console.log("ss");




// process.exit();
// const routes = require(`./routes/routes.js`)