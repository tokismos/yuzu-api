const express = require("express");
const router = express.Router();
const recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  let filters = [];
  //get all the data from url and put it in array to spread it in $and
  if (req.query) {
    console.log(req.query);
    const keys = Object.keys(req.query);
    keys.forEach((key) => {
      filters.push({ [key]: req.query[key] });
    });
    console.log(filters);
  }
  const result = await recipe.find(
    //if there's filters we add them to the query sinon we get all !
    filters.length
      ? {
          $and: [...filters],
        }
      : {}
  );
  res.send(result);
  return result;
});

router.post("/add", async (req, res) => {
  const newRecipe = new recipe({
    imgURL: req.body.imgURL,
    name: req.body.name,
    difficulty: req.body.difficulty,
    steps: req.body.steps,
    ingredients: req.body.ingredients,
  });
  // recipe.exists({ name: recipee.name }, function (err, doc) {
  //   if (err) {
  //     console.log(err);

  //   } else {
  //     console.log("Result :", doc); // false
  //   }
  // });
  try {
    const res = await newRecipe.save();
    console.log("reeeeees", res);
    res.status(200).json({ message: "DATA ADDED TO DB" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

  // res.send(req.body);
  // console.log(req.body);
  // console.log("hooooooooooo");
});

module.exports = router;
