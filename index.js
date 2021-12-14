//require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const recipesRouter = require("./routes/recipes");
const verifyRouter = require("./routes/verify");
const emailRouter = require("./routes/email");

const cors = require("cors")({
  origin: "*",
});
const port = process.env.PORT || 3000;

app.use(cors);

app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/recipes", recipesRouter);
app.use("/phoneNumber", verifyRouter);
app.use("/email", emailRouter);

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
