require('dotenv').config();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.PASS,
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    req.session.email = email;
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).render('register.ejs',{ errorMessage: 'User already exists' });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({ name, email, password: hashedPassword, otp, otpExpiry });
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP verification code is ${otp}`,
    });

    res.render('verifyOTP.ejs', {
      successMessage:
        'User registered successfully. Please verify the OTP sent to your email.',
    });
  } catch (error) {
    res.status(500).render('register.ejs', {
      errorMessage: 'Error registering user',
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.email;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .render('verifyOTP.ejs', { errorMessage: 'User Not Found' });
    if (user.isVerified)
      return res
        .status(400)
        .render('verifyOTP.ejs', { errorMessage: 'User already verified' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res
        .status(400)
        .render('verifyOTP.ejs', { errorMessage: 'Invalid or Expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.render('login.ejs', {
      successMessage: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    res
      .status(500)
      .render('verifyOTP.ejs', { errorMessage: 'Error verifying OTP', error });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .render('verifyOTP.ejs', {
          errorMessage: 'User Not Found',
        });

    if (user.isVerified)
      return res
        .status(400)
        .render('login.ejs', { errorMessage: 'User already verified' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Resent OTP verification',
      text: `Your new OTP is ${otp}`,
    });
    res.render('verifyOTP.ejs', { successMessage: 'OTP resent successfully.' });
  } catch (error) {
    res
      .status(500)
      .render('verifyOTP.ejs', { errorMessage: 'Error resending OTP', error });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).render('login.ejs', {
        errorMessage: 'User does not exist please create an account',
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .render('login.ejs', { errorMessage: 'Incorrect Password' });

    if (!user.isVerified)
      return res.status(400).render('verifyOTP.ejs', {
        errorMessage: 'Email not verified. Please verify OTP',
      });

    req.session.user = { id: user._id, email: user.email, name: user.name };
    res.redirect('/dashboard');
  } catch (error) {
    res
      .status(500)
      .render('login.ejs', { errorMessage: 'Error Logging in user', error });
  }
};

// Logout User
exports.logout = (req, res) => {
  req.session.message = 'Logged out successfully';
  const successMessage = req.session.message;
  req.session.destroy((err) => {
    if (err) return res.status(500).render('dashboard.ejs',{ errorMessage: 'Error logging out' });
    res.render('login.ejs', { successMessage });
  });
};

// Dashboard (Protected Route)
exports.dashboard = async (req, res) => {
  const { name, email } = req.session.user;
  res.render('dashboard.ejs', { name, email });
};
