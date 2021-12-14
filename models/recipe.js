const mongoose = require("mongoose");
const ingredientsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unite: { type: String, required: true },
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
  category: {
    type: Array,
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
  tempsAttente: {
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
  material: {
    type: Array,
    required: true,
  },
  ingredients: [ingredientsSchema],
});

const model = mongoose.model("recipe", recipeSchema);
module.exports = model;
