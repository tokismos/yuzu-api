//require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const recipesRouter = require("./routes/recipes");
// const cors = require("cors")({
//   origin: "*",
// });
const port = process.env.PORT || 3000;

// app.use(cors);
app.use(express.json());
app.use("/recipes", recipesRouter);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

mongoose.connection.once("connected", () => {
  console.log("connected to DB !!!");
});
mongoose.connection.on("error", (err) => {
  console.error("error connecting", err);
});

app.listen(port, () => console.log("connencted"));
