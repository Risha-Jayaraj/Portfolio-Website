// server.js

// Import required packages
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // To manage environment variables

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and handle CORS
app.use(express.json());
app.use(cors());

// Serve the static HTML file from the root directory
app.use(express.static(__dirname)); 

// POST route to handle form submissions
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a transporter object using Gmail SMTP
    // IMPORTANT: You'll need to use an "App Password" for Gmail if you have 2FA enabled.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email from .env file
            pass: process.env.EMAIL_PASS  // Your email app password from .env file
        }
    });

    // Setup email data
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's name and email
        to: process.env.EMAIL_USER,    // Your receiving email address
        subject: `New Portfolio Contact: ${subject}`,
        text: `You have a new message from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Something went wrong. Please try again.');
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send('Message sent successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});