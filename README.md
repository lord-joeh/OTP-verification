# OTP Verification System

A secure Node.js application for user authentication with email-based OTP (One-Time Password) verification. This system provides a robust way to verify user identities through email verification codes.

## Features

- User registration with email verification
- Secure OTP generation and validation
- Session-based authentication
- Email-based OTP delivery
- Password hashing using bcrypt
- MongoDB database integration
- Responsive EJS templates
- Dashboard access control

## Tech Stack

- **Runtime Environment:** Node.js v20.15.0
- **Framework:** Express.js v4.21.2
- **Database:** MongoDB v6.13.0 with Mongoose v8.10.0
- **Template Engine:** EJS v3.1.10
- **Authentication:** express-session v1.18.1
- **Email Service:** Nodemailer v6.10.0
- **Security:** bcrypt v5.1.1

## Prerequisites

- Node.js (v20.15.0)
- MongoDB installed and running
- Gmail account (for sending OTP emails)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lord-joeh/OTP-verification.git
   cd OTPverification
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   FROM_EMAIL=your_gmail_address
   PASS=your_gmail_app_password
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Access the application at:
   ```
   http://localhost:3000
   ```

## API Routes

### Authentication Routes
- `POST /register` - Register a new user
- `POST /verify-otp` - Verify OTP sent to email
- `POST /resend-otp` - Resend OTP if expired
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /dashboard` - Protected dashboard route

### Page Routes
- `GET /` - Home/Login page
- `GET /register` - Registration page
- `GET /verify-otp` - OTP verification page
- `GET /resend-otp` - OTP resend page

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- OTP expiration after 10 minutes
- Secure email delivery using Nodemailer
- Protected routes using authentication middleware


## License

ISC