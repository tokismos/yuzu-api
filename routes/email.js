const util = require('util');
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const { google } = require('googleapis');

const debug = o => console.log(util.inspect(o, false, null, true));

const sendMail = async (req, res) => {
  const OAuth2 = google.auth.OAuth2;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  debug({ clientId, clientSecret, refreshToken })
  const myOAuth2Client = new OAuth2(
    clientId,
    clientSecret
  );

  myOAuth2Client.setCredentials({ refresh_token: refreshToken });
  const accessToken = await myOAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      clientId,
      clientSecret,
      refreshToken,
      accessToken
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: "edouard.jubert@gmail.com",
    subject: `${req.body.fullName || ''}- ${req.body.title || ''}`,
    text: req.body.message || '',
  };

  debug({ mailOptions });

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log({ error })
      throw new Error("ERROR EMAIL NOT SENT");
    } else {
      res.send("EMAIL SENT");
    }
  });
}

router.post("/", sendMail);
module.exports = { default: router, sendMail };
