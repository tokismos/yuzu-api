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

  difficulty: {
    type: String,
    required: true,
  },

  steps: {
    type: Array,
    required: true,
  },
  nbrPersonne: {
    type: String,
    required: true,
  },
  tempsPreparation: {
    type: String,
    required: true,
  },
  tempsCuisson: {
    type: String,
    required: true,
  },
  ingredients: [ingredientsSchema],
});

const model = mongoose.model("recipe", recipeSchema);
module.exports = model;
