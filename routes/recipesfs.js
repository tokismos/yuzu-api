require('dotenv').config();
const express = require("express");

const https = require('https');
const fs = require('fs');
const Stream = require('stream').Transform;
const path = require('path');
const os = require('os');
const sharp = require('sharp');
const { getAuth } = require('firebase-admin/auth');
const admin = require("firebase-admin");

const router = express.Router();

const serviceAccount = require('../yuzu-5720e-firebase-adminsdk-65ckj-bdc318a85a.json');
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
};

if(!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}
else admin.app()

var db = admin.firestore();

const isAdmin = async (idToken) => {
  return await getAuth()
    .verifyIdToken(idToken)
    .then((claims) => {
      return claims.admin === true;

    })
    .catch((error) => {
      console.log(error)
      return false
    });
}

router.get("/all", async (req, res) => {
  const ref = db.collection("recipes");
  const result = await ref.get().then((snapshot) => {
    return snapshot.docs.map(doc => {
      return { _id: doc.id, ...doc.data() }
    })
  });
  res.send(result);
  return result;

});

router.get("/ratings/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401);
    return
  }

  const ref = db.collection("rate");
  const result = await ref.get().then((snapshot) => {
    return snapshot.docs.map(doc => {
      return {...doc.data() }
    })
  });

  res.send(result);

  return result;


});

router.get('/byName/:name', async (req, res) => {
  const { name } = req.params;

  if (!name) res.status(400).send({ msg: "Bad format" });

  try {
    const ref = db.collection("recipes");
    const result = await ref.where("name", '==', name).get().then((snapshot) => {
      return snapshot.docs.map(doc => {
        return { _id: doc.id, ...doc.data() }
      })
    });
    if (result.length == 0) throw Error('not found');
    res.send(result[0]);
  } catch (e) {
    res.send(e);
  }
})

router.get("/:id", async (req, res) => {
  // const result = await recipe.find({ _id: req.params.id });

  const ref = db.collection("recipes");
  const result = await ref.doc(req.params.id).get().then((doc) => {
    return doc.exists ? [{ _id: doc.id, ...doc.data() }] : []
  });

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
    const ref = db.collection("recipes");
    await ref.doc(req.params.id).update({
      isVisible: req.params.value
    })
      .then(() => {
        res.status(200).send({ message: "Visible Modified successfuly" });
      })

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
    // set() instead of update() to replace all recipe data by req.body
    const recipeId = req.body._id
    delete req.body._id
    const ref = db.collection("recipes");
    await ref.doc(recipeId).set(
      req.body
    )
      .then(() => {
        res.status(200).send({ message: "DATA Modified successfuly" });
      })

  } catch (e) {
    res.status(400).send({ message: "Error, NOT MODIFIED", error: e });
  }
});
router.patch("/incrementRight", async (req, res) => {
  try {
    const ref = db.collection("recipes");
    await ref.doc(req.body._id).update({
      "stats.nbrRight": admin.firestore.FieldValue.increment(1)
    })
      .then(() => {
        res.status(200).send({ message: "Incremented by one Successfuly R" });
      })

  } catch (e) {
    console.log("Erreur , Increment didnt work !", e);
  }
});
router.patch("/incrementLeft", async (req, res) => {
  try {
    const ref = db.collection("recipes");
    await ref.doc(req.body._id).update({
      "stats.nbrLeft": admin.firestore.FieldValue.increment(1)
    })
      .then(() => {
        res.status(200).send({ message: "Incremented by one Successfuly L" });
      })
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

    const ref = db.collection("recipes");
    await ref.doc(req.params.id).delete()
      .then(() => {
        res.status(200).send({ message: "User deleted successfuly" });
      })


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

    const ref = db.collection("recipes");
    await ref.doc(req.body.item._id).update({
      thumbURL: req.body.thumbURL
    })
      .then(() => {
        res.status(200).send({ data });
      })

  } catch (e) {
    console.error(e);
    res.status(500).send({ err: e })
  }
})

router.post("/add/:idToken", async (req, res) => {

  if (!(await isAdmin(req.params.idToken))) {
    res.status(401)
    return
  }

  try {
    const ref = db.collection("recipes");
   await ref.add({
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
    }).then(()=> {
      res.status(200).send({ message: "DATA ADDED TO DB" });

    })

  } catch (err) {
    res.status(400).send({ message: "Error, NOT ADDED TO DB", error: err });
  }
});


module.exports = router;
