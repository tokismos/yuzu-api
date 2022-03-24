const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51KfDxdLPkFeT5Lr1BBgze1K7BmB7EfccpoA3mnaYQJPzgp5c9471CUpLHAYp99gEUNf5OE4877qlmivNtdk9JiZ100VMYGvbi6"
);

router.post("/", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "eur",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51KfDxdLPkFeT5Lr1S3sUQRJuwjTIP8auNmjjHWbzDOidqq7bqiIDYek6Gv2lhd0R7e7ZU5tyKAfU52cgwHVX3cK300zN5DzXhx",
  });
});

module.exports = router;
