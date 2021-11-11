const mongoose = require("mongoose");
const ingredientsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { _id: false }
);
const recipeSchema = new mongoose.Schema({
  imgURL: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  four: {
    type: Boolean,
    required: true,
  },
  microOnde: {
    type: Boolean,
    required: true,
  },
  mixeur: {
    type: Boolean,
    required: true,
  },
  robotCuiseur: {
    type: String,
    required: true,
  },
  friteuse: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    required: true,
  },

  steps: {
    type: Array,
    required: true,
  },
  nbrPersonne: {
    type: Number,
    required: true,
  },
  tempsPreparation: {
    type: Number,
    required: true,
  },
  tempsCuisson: {
    type: Number,
    required: true,
  },
  isMeat: {
    type: Boolean,
    required: true,
  },
  isFish: {
    type: Boolean,
    required: true,
  },
  isVegetarien: {
    type: Boolean,
    required: true,
  },
  isVegan: {
    type: Boolean,
    required: true,
  },
  isNoGluten: {
    type: Boolean,
    required: true,
  },
  ingredients: [ingredientsSchema],
});

const model = mongoose.model("recipe", recipeSchema);
module.exports = model;
