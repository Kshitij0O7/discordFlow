const twilio = require('twilio');

// Your Twilio account SID and Auth Token
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';

const client = new twilio(accountSid, authToken);

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

// Create a transporter using your email service's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'YourEmailService', // e.g., 'Gmail' or use your SMTP settings
  auth: {
    user: 'your@email.com',
    pass: 'your_password',
  },
});

// Function to send OTP via email
module.exports = sendOTPEmail = (email, title, message) => {
  const mailOptions = {
    from: 'your@email.com', // Sender's email address
    to: email, // Recipient's email address
    subject: {title},
    text: {message},
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP via email:', error);
    } else {
      console.log('OTP sent via email:', info.response);
    }
  });
}

// Function to send OTP via SMS
module.exports = sendOTPSMS = (phone, otp) => {
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: 'your_twilio_phone_number',
      to: phone,
    })
    .then((message) => console.log('OTP sent via SMS:', message.sid))
    .catch((error) => console.error('Error sending OTP via SMS:', error));
}

module.exports =  generateToken = (_email) => {
    const payload = {
      email: _email,
    };
  
    const token = jwt.sign(payload, 'ssllhh', { expiresIn: '24h' });
    return token;
};