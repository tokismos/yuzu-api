const express = require("express");
const router = express.Router();

const client = require("twilio")(
  "AC24027584fc3fe1af1743bea7d97b501e",
  "038cb60b3c71b14266b24ed404f1bcfa"
);

router.get("/num", async (req, res) => {
  try {
    //await client.verify;
    // .services("VA9f3276ce2a6747880cb21beeb4c845d5")
    // .verifications.create({
    //   to: `+212675234067`,
    //   // to: `+${req.query.phoneNumber}`,
    //   channel: "sms",
    // });
    console.log("9ra hnaaa");
    return res.send("SMS Sent");
  } catch (e) {
    console.log("Erreur", e);
    res.status(400).send("SMS not sent !");
  }
});

router.get("/verify", async (req, res) => {
  try {
    // const result = await client.verify
    //   .services("VA9f3276ce2a6747880cb21beeb4c845d5")
    //   .verificationChecks.create({
    //     to: `+${req.query.phoneNumber}`,
    //     code: `+${req.query.verificationCode}`,
    //   });

    return res.send("code valid");

    // console.log("finished result", result);
    // if (result.status == "approved") {
    //   return res.send(result.status);
    // } else {
    //   res.status(400).send("CODE NOT APPROVED");
    // }
  } catch (e) {
    console.log("ERROR", e);
    res.status(400).send("CODE NOT APPROVED");
  }
  // if (resultat == "approved") {
  //   return res.send("CODE APPROVED");
  // }
  // console.log("resssultat", resultat.status);
  // return res.send({ status: resultat.status });
});

module.exports = router;
