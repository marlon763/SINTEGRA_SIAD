const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    // secure: false, // true for port 465, false for other ports
    auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
    }
  }
);

module.exports = transport