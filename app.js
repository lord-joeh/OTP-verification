require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');


//connect to MongoDB
connectDB;

const app = express();
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const authRoutes = require('./routes/authRoutes.js');

app.use('/api/auth', authRoutes);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
});