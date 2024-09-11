// mailgunConfig.js
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

// Your Mailgun credentials
const mailgunAuth = {
  auth: {
    api_key: '2b755df8-2d842140',
    domain: 'sandbox7c0ebb6eba764c48abcc05eae4fde702.mailgun.org'
  }
};

// Create a Nodemailer transport object
const transporter = nodemailer.createTransport(mg(mailgunAuth));

module.exports = transporter;