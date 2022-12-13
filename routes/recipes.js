require('dotenv').config();
const express = require("express");

const https = require('https');
const fs = require('fs');
const Stream = require('stream').Transform;
const path = require('path');
const os = require('os');
const sharp = require('sharp');
const { getStorage, getBucket, ref, listAll, uploadBytes, getDownloadURL } = require('firebase-admin/storage');
const { getAuth } = require('firebase-admin/auth');
const admin = require("firebase-admin");

const router = express.Router();
const recipe = require("../models/recipe");

const serviceAccount = require('../yuzu-5720e-firebase-adminsdk-65ckj-bdc318a85a.json');
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

admin.initializeApp(firebaseConfig);

var db = admin.database();

const storage = getStorage().bucket('gs://yuzu-5720e.appspot.com');

const adminUsers = [process.env.ADMIN_USER1]

const isAdmin = async (idToken) => {
  const id = await getAuth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
   return decodedToken.uid;
    // ...
  })
  .catch((error) => {
    console.log(error)
    return ""
  });
  return adminUsers.includes(id) 
}

router.get("/all", async (req, res) => {
  const result = await recipe.find({});
  res.send(result);
  return result;

});

router.get("/ratings/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }

  var ref = db.ref("/rate");

  const result = await ref.once('value', (data) => {
    return data
  });

  res.send(result);

  return result;


});

router.get("/", async (req, res) => {
  let filters = [];
  //get all the data from url and put it in array to spread it in $and
  if (req.query) {
    const keys = Object.keys(req.query);
    console.log("keys", keys);
    keys.forEach((key) => {
      filters.push({ [key]: req.query[key] });
    });
    console.log("THIS IS FILTERS", filters);
  }

  console.log("..Filters", ...filters);
  const result = await recipe.find(
    //if there's filters we add them to the query sinon we get all !
    {
      $and: [
        //to get just the recipes that are working
        { isVisible: true },

        // if difficulty exist in query , here even if we have multiple value like difficulty = difficile and
        // difficulty= facile  it will look for each one of them

        req.query.difficulty ? { difficulty: req.query.difficulty } : {},

        //we have isArray because when its just one value its  not working so it should be an array to do in
        req.query.category
          ? Array.isArray(req.query.category)
            ? {
              category: {
                $in: [...req.query.category],
              },
            }
            : { category: req.query.category }
          : {},

        req.query.regime
          ? Array.isArray(req.query.regime)
            ? {
              regime: {
                $in: [...req.query.regime],
              },
            }
            : { regime: req.query.regime }
          : {},

        // it will be less than or equal the value
        req.query.tempsTotal
          ? { tempsTotal: { $lte: req.query.tempsTotal } }
          : {},

        //we have isArray because when its just one value its  not working so it should be an array to do in

        req.query.material
          ? Array.isArray(req.query.material)
            ? { material: { $in: [...req.query.material] } }
            : { material: req.query.material }
          : {},
      ],
    }
  );
  res.send(result);
  console.log("Number", result.length);
  let names = [];
  result.map((i) => names.push(i.name));
  console.log("LENGTH", result.length);
  return result;
});

router.get("/filters", async (req, res) => {
  const result = await recipe.find({ _id: req.params.id });

  res.send(result);
  return result;
});
router.patch("/tmp/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }
  try {
    await recipe.updateMany(
      {},
      [
        {
          $set: {
            tempsTotale: {
              $sum: [`$tempsPreparation`, "$tempsCuisson", "$tempsAttente"],
            },
          },
        },
      ],
      { upsert: true }
    );
    console.log("dazha");
  } catch (e) {
    console.log("Qrreye", e);
  }
  res.send("DONE");
  return "DONE";
});

router.get('/byName/:name', async (req, res) => {
  const { name } = req.params;

  if (!name) res.status(400).send({ msg: "Bad format" });

  try {
    const result = await recipe.find({ name });

    if (!Array.isArray(result) || result === 0) throw Error('not found');
    res.send(result[0]);
  } catch (e) {
    res.send(e);
  }
})

router.get("/:id", async (req, res) => {
  const result = await recipe.find({ _id: req.params.id });

  res.send(result);
  return result;
});
//Modifier la recette
router.patch("/toggleVisible/:id/:value/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }
  try {
    await recipe
      .findByIdAndUpdate(
        req.params.id,
        { isVisible: req.params.value },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Visible: ", docs);
            res.status(200).send({ message: "Visible Modified successfuly" });
          }
        }
      )
      .clone();
  } catch (e) {
    res.status(400).send({ message: "Error, NOT MODIFIED", error: e });
  }
});

router.patch("/modify/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }
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
    res.status(200).send({ message: "Incremented by one Successfuly L " });
  } catch (e) {
    console.log("Erreur , Increment didnt work !", e);
  }
});
//Supprimer la recette
router.delete("/:id/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }

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

router.post('/thumb/:idToken', async (req, res) => {
  if (!req.body.thumbURL || !req.body.item._id || !(await isAdmin(req.params.idToken))) {

    res.status(401);
    return
  }

  try {
    await recipe.findByIdAndUpdate(req.body.item._id, { thumbURL: req.body.thumbURL }, (err, data) => {
      if (err) res.status(500).send({ err })
      res.status(200).send({ data });
    }).clone();
  } catch (e) {
    console.error(e);
  }
})

router.post('/uploadstorage/:idToken', async (req, res) => {
  if (!req.body.fileName || !req.body.file || !(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }
  try {



    // const fileRef = ref(storage, req.body.fileName);
  
    // const url = await uploadBytes(fileRef, req.body.file).then(async (snapshot) => {
    //   console.log("Uploaded a blob or file!", snapshot);
    //   return getDownloadURL(fileRef)
    //     .then(async (downloadURL) => {
    //       return downloadURL
    //     })
       
    // });
  
    //  res.status(200).send({ url });    
    res.status(200).send();   
   
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: "Error, NOT ADDED TO DB", error: err });
  }
})

router.post("/add/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401)
    return
  }

  const newRecipe = new recipe({
    imgURL: req.body.imgURL,
    thumbURL: req.body.thumbURL,
    videoURL: req.body.videoURL,
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
    regime: req.body.regime,
    material: req.body.material,
    isVisible: true,
    tempsTotal: req.body.tempsTotal,
  });
  try {
    const result = await newRecipe.save();
    res.status(200).send({ message: "DATA ADDED TO DB" });
  } catch (err) {
    res.status(400).send({ message: "Error, NOT ADDED TO DB", error: err });
  }
});

// Utilisé pour compresser toutes images des recettes actuelles

// router.post("/editImg", async (req, res) => {
//   if (!req.body._id || !req.body.newImg) res.status(400);
//   try {
//     await recipe.findByIdAndUpdate(req.body._id, { imgURL: req.body.newImg }, (err, data) => {
//       if (err) res.status(500).send({ err })
//       res.status(200).send({ data });
//     }).clone();
//   } catch (e) {
//     console.error(e);
//   }

// });

module.exports = router;
