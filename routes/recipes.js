const express = require("express");
const router = express.Router();
const recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  let filters = [];
  console.log("filters", filters);
  //get all the data from url and put it in array to spread it in $and
  if (req.query) {
    console.log("query", req.query);
    const keys = Object.keys(req.query);
    console.log("keys", keys);
    keys.forEach((key) => {
      filters.push({ [key]: req.query[key] });
    });
  }
  if (req.query.difficulty) {
    console.log("difficulty hhh");
  }

  const result = await recipe.find(
    //if there's filters we add them to the query sinon we get all !
    filters.length
      ? {
          $and: [...filters],
          // regime: false && { $all: [] },
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
    nbrPersonne: req.body.nbrPersonne,
    tempsCuisson: req.body.tempsCuisson,
    tempsPreparation: req.body.tempsPreparation,
    ingredients: req.body.ingredients,
    four: req.body.four,
    microOnde: req.body.microOnde,
    mixeur: req.body.mixeur,
    robotCuiseur: req.body.robotCuiseur,
    friteuse: req.body.friteuse,
    isMeat: req.body.isMeat,
    isFish: req.body.isFish,
    isVegetarien: req.body.isVegetarien,
    isVegan: req.body.isVegan,
    isNoGluten: req.body.isNoGluten,
  });
  // recipe.exists({ name: recipee.name }, function (err, doc) {
  //   if (err) {
  //     console.log(err);

  //   } else {
  //     console.log("Result :", doc); // false
  //   }
  // });
  try {
    const result = await newRecipe.save();
    console.log("reeeeees", result);
    res.status(200).send({ message: "DATA ADDED TO DB" });
  } catch (err) {
    console.log("eroroororo");
    res.status(400).send({ message: "Error, NOT ADDED TO DB" });
  }

  // res.send(req.body);
  // console.log(req.body);
  // console.log("hooooooooooo");
});

module.exports = router;
