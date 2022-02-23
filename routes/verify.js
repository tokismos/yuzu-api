const express = require("express");
const router = express.Router();

const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_PASSWORD
);

router.get("/send", async (req, res) => {
  try {
    await client.verify
      .services("VA1491bf0d469caa11eb0701f6d5f8e0e1")
      .verifications.create({
        to: `+${req.query.phoneNumber}`,
        channel: "sms",
      });
    console.log("Verification code sent to number !");
    return res.send("SMS Sent");
  } catch (e) {
    console.log("Erreur", e);
    res.status(400).json("SMS not sent !");
  }
});

router.get("/verify", async (req, res) => {
  console.log("start");
  try {
    const result = await client.verify
      .services("VA1491bf0d469caa11eb0701f6d5f8e0e1")
      .verificationChecks.create({
        to: `+${req.query.phoneNumber}`,
        code: `${req.query.verificationCode}`,
      });
    console.log("resssultat", req.query.verificationCode);
    if (result.status == "approved") {
      return res.json("CODE APPROVED");
    }
    res.status(400).json({ error: "Code Not Valid !" });
  } catch (e) {
    return res.status(e.status).json({ error: "There is an error" });
  }
});

module.exports = router;
