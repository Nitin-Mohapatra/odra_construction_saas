const express = require("express");
const { body, validationResult } = require('express-validator');
const Message = require('../models/message');
const nodemailer = require("nodemailer");
const env = require("dotenv").config()

// Fake SMTP (Ethereal)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",   // ✅ correct hostname
  port: 465,                // ✅ secure port
  secure: true, 
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
  }
});

const sendEmail = async (from, to, subject, msg, html = "") => {
  try {
    const info = await transporter.sendMail({
      from: `PBM Team <${from}>`,
      to,
      subject,
      text: msg,
      html,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error while sending mail:", err);
    return false;
  }
};

const messagePost = express.Router();

messagePost.post(
  '/contact-us',
  [
    body('name').notEmpty().withMessage("Name can't be empty"),
    body('message').escape().notEmpty().withMessage("Message can't be empty"),
    body('email').isEmail().withMessage("Invalid email address"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(`Validation Error: ${errors.array()}`);
      return res.status(400).json({ success: false, error: errors.array() });
    }

    try {
      const { name, email, message } = req.body;

      // Check if user already has messages
      const existingUser = await Message.findOne({ email });

      if (existingUser) {
        await Message.findOneAndUpdate(
          { email },
          { $push: { messages: { msg: message, createdDate: new Date() } } },
          { new: true }
        );
      } else {
        await Message.create({
          name,
          email,
          messages: [{ msg: message, createdDate: new Date() }]
        });
      }

      // Send notification email to admin
      const mailSuccess = await sendEmail(
        email,
        "nitinmohapatra26@gmail.com",
        "📩 New Contact Message",
        `From: ${name}\nEmail: ${email}\nMessage: ${message}`
      );

      if (!mailSuccess) {
        return res.status(500).json({success: false,error: "Internal Server Error. Message Couldn't be send"})
      }

      return res.status(200).json({ success: true, message: "Message received successfully" });

    } catch (err) {
      console.error("Error handling message:", err);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = { messagePost };





/*
✅ Gmail Nodemailer Setup — Detailed Explanation

--------------------------------------------------------
⚙️ 1️⃣ host, port, secure, auth — what they mean
--------------------------------------------------------

When we send an email through Nodemailer, we are basically connecting to Gmail’s 
mail server (SMTP server) — just like your Gmail app does when it sends mail.

These fields tell Nodemailer *how* to connect to Gmail’s email server.

| Field        | Meaning                                                                                                                   | What we use                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| host          | The domain name of the email service’s SMTP server (where to send emails).                                                | "smtp.gmail.com" → Gmail’s outgoing mail server. |
| port          | The communication port number on that mail server.                                                                        | 465 (secure SSL) or sometimes 587.               |
| secure        | If true → uses SSL/TLS encryption (safe). If false → starts plain and upgrades to secure (STARTTLS).                     | true → because port 465 uses SSL.                |
| auth          | Contains your Gmail credentials so the server knows it’s you sending the mail.                                            | { user: "yourgmail@gmail.com", pass: "app-pass"} |

--------------------------------------------------------
🔐 2️⃣ Why enable 2-Step Verification?
--------------------------------------------------------

Gmail no longer allows normal password login from third-party apps like Nodemailer.
If you try to use your Gmail password, Google blocks the login.

By enabling 2-Step Verification, you allow Google to generate special “App Passwords”
for trusted apps (like Node.js mailers). This keeps your main Gmail password safe.

--------------------------------------------------------
🔑 3️⃣ What is an App Password?
--------------------------------------------------------

When you visit → https://myaccount.google.com/apppasswords
and generate a new one (choose “Mail” and “Other”), Google gives you a
16-character password like this:

    abcd efgh ijkl mnop

That is your App Password — a one-time key used *only* for sending mail through code.

Use it like this:
--------------------------------------------------------

auth: {
  user: "yourgmail@gmail.com",
  pass: "abcd efgh ijkl mnop", // your app password
}

Even if someone sees this in your code, they can’t access your Gmail account.
You can revoke it anytime from your Google account security settings.

--------------------------------------------------------
💡 Quick Summary
--------------------------------------------------------

| Term                    | Meaning                                           |
| ----------------------- | ------------------------------------------------- |
| host                    | Gmail SMTP server address                         |
| port                    | Communication port (465 = SSL secure)             |
| secure                  | Enables SSL/TLS encryption                        |
| auth.user               | Your Gmail address                                |
| auth.pass               | 16-digit App Password from Google                 |
| 2-Step Verification     | Required to generate app passwords                |
| App Password            | Safer login key for Nodemailer instead of real pw |

--------------------------------------------------------

💬 Tip:
You can further improve this by using an `.env` file to hide your Gmail
credentials instead of hardcoding them into your code.
*/
