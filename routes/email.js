const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

//Send an email

router.post("/", async (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: "yuzuapp1@gmail.com",
    subject: req.body.title,
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw new Error("ERROR EMAIL NOT SENT");
    } else {
      res.send("EMAIL SENT");
    }
  });
});
module.exports = router;
