const express = require("express");

const router = express.Router();
const recipe = require("../models/recipe");

router.get("/", async (req, res) => {
  let filters = [];
  console.log("Req Queeeery", req.query);
  //get all the data from url and put it in array to spread it in $and
  if (req.query) {
    const keys = Object.keys(req.query);
    console.log("keys", keys);
    keys.forEach((key) => {
      filters.push({ [key]: req.query[key] });
    });
    console.log("THIS IS FILTERS", filters);
  }
  if (req.query.category) {
    console.log("difficulty hhh", req.query.difficulty);
  }

  console.log("..Filters", ...filters);
  const result = await recipe.find(
    //if there's filters we add them to the query sinon we get all !
    {
      $and: [
        req.query.difficulty ? { difficulty: req.query.difficulty } : {},
        req.query.category
          ? Array.isArray(req.query.category)
            ? { category: { $in: [...req.query.category] } }
            : { category: req.query.category }
          : {},
        req.query.tempsCuisson
          ? { tempsCuisson: { $lte: req.query.tempsCuisson } }
          : {},
        req.query.material
          ? Array.isArray(req.query.material)
            ? { material: { $in: [...req.query.material] } }
            : { material: req.query.material }
          : {},
      ],
      // regime: false && { $all: [] },
    }
  );
  res.send(result);
  let names = [];
  result.map((i) => names.push(i.name));
  console.log("LENGTH", result.length, names);
  return result;
});

router.get("/filters", async (req, res) => {
  const result = await recipe.find({ _id: req.params.id });

  res.send(result);
  return result;
});
router.get("/:id", async (req, res) => {
  const result = await recipe.find({ _id: req.params.id });

  res.send(result);
  return result;
});
//Modifier la recette
router.patch("/modify", async (req, res) => {
  try {
    await recipe
      .findByIdAndUpdate(req.body._id, req.body, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated User : ", docs);
          res.status(200).send({ message: "DATA Modified successfuly" });
        }
      })
      .clone();
  } catch (e) {
    res.status(400).send({ message: "Error, NOT MODIFIED", error: e });
  }
});
router.patch("/incrementRight", async (req, res) => {
  try {
    await recipe.findByIdAndUpdate(req.body._id, {
      $inc: { "stats.nbrRight": 1 },
    });
    console.log("incremented by one");
    res.status(200).send({ message: "Incremented by one Successfuly R" });
  } catch (e) {
    console.log("Erreur , Increment didnt work !", e);
  }
});
router.patch("/incrementLeft", async (req, res) => {
  try {
    await recipe.findByIdAndUpdate(req.body._id, {
      $inc: { "stats.nbrLeft": 1 },
    });
    console.log("incremented by one");
    res.status(200).send({ message: "Incremented by one Successfuly L " });
  } catch (e) {
    console.log("Erreur , Increment didnt work !", e);
  }
});
//Supprimer la recette
router.delete("/:id", async (req, res) => {
  console.log("this is item id", req.params.id);
  try {
    await recipe.findByIdAndDelete(req.params.id, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted user ", docs);
        res.status(200).send({ message: "User deleted successfuly" });
      }
    });
  } catch (e) {
    console.log("Error not deleted", e);
  }
});
router.post("/add", async (req, res) => {
  const newRecipe = new recipe({
    imgURL: req.body.imgURL,
    tempsAttente: req.body.tempsAttente,
    chefName: req.body.chefName,
    name: req.body.name,
    difficulty: req.body.difficulty,
    steps: req.body.steps,
    nbrPersonne: req.body.nbrPersonne,
    tempsCuisson: req.body.tempsCuisson,
    tempsPreparation: req.body.tempsPreparation,
    ingredients: req.body.ingredients,
    category: req.body.category,
    material: req.body.material,
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
    console.log("eroroororo", err);
    res.status(400).send({ message: "Error, NOT ADDED TO DB", error: err });
  }

  // res.send(req.body);
  // console.log(req.body);
  // console.log("hooooooooooo");
});

module.exports = router;
