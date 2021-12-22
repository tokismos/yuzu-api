const express = require("express");
const router = express.Router();

const client = require("twilio")(
  "AC0938f5cd6bccbcf12a3fb26d7cca3d4f",
  "1aa46c0271fc6bf8c5da7124e2c47108"
);

router.get("/send", async (req, res) => {
  try {
    await client.verify
      .services("VAb8c7158264697e5c7a5b707f5b743da5")
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
      .services("VAb8c7158264697e5c7a5b707f5b743da5")
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
