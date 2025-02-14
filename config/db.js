require('dotenv').config()
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
    await User.createCollection;
    console.log('User Collections Created Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed', error.message);
    process.exit(1);
  }
};
connectDB();

mongoose.model.exports = connectDB;
