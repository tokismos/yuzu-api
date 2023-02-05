const mongoose = require("mongoose");
const ingredientsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unite: { type: String, required: true },
  },
  { _id: false }
);
const statsSchema = new mongoose.Schema(
  {
    nbrRight: { type: Number, required: false },
    nbrLeft: { type: Number, required: false },
  },
  { _id: false }
);
const ratingsSchema = new mongoose.Schema(
  {
    "0,5": { type: Number, required: false },
    1: { type: Number, required: false },
    "1,5": { type: Number, required: false },
    2: { type: Number, required: false },
    "2,5": { type: Number, required: false },
    3: { type: Number, required: false },
    "3,5": { type: Number, required: false },
    4: { type: Number, required: false },
    "4,5": { type: Number, required: false },
    5: { type: Number, required: false },
  },
  { _id: false }
);
const recipeSchema = new mongoose.Schema({
  imgURL: {
    type: String,
    required: true,
  },
  thumbURL: {
    type: String,
    required: true,
  },
  videoURL: {
    type: String,
    required: false,
  },
  chefName: {
    type: String,
    required: false,
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
  tempsTotal: {
    type: Number,
    required: true,
  },
  saison: {
    type: String,
    required: true,
  },
  material: {
    type: Array,
    required: true,
  },
  typesPlat: {
    type: Array,
  },

  regime: {
    type: Array,
  },

  ingredients: [ingredientsSchema],
  stats: statsSchema,
  isVisible: { type: Boolean },
  ratings: ratingsSchema,
});

const model = mongoose.model("recipe", recipeSchema);
module.exports = model;
