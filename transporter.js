const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EmailUser,
        pass: process.env.EmailPassword
    }
});


module.exports = transporter;