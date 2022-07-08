const express = require('express');
const router = express.Router()

const { sendMail } = require('./email');

router.get("/", async (req, res) => {
  console.log('Calling sendMail');
  await sendMail(req, res);
  res.status(200).send({ msg: 'hello' })
});

module.exports = router;
