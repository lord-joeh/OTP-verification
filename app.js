require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');

//connect to MongoDB
connectDB;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.set('view-engine', 'ejs');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes.js');

app.use( authRoutes );

//Get register page
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.get('/', (req, res) => {
  res.render('login.ejs');
});

//Get Login Page
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

//Get Request otp page
app.get('/verify-otp', (req, res) => {
  res.render('verifyOTP.ejs');
});

//Get Resend otp page
app.get('/resend-otp', (req, res) => {
  res.render('resendOTP.ejs');
});


app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
