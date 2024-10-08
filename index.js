// require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const recipesRouter = require("./routes/recipes");
const recipesfsRouter = require("./routes/recipesfs");
const verifyRouter = require("./routes/verify");
const { default: emailRouter } = require("./routes/email");
const payRouter = require("./routes/pay");
const defaultRouter = require('./routes/default');

const cors = require("cors")({
  origin: "*",
});
const port = process.env.PORT || 3000;

app.use(cors);

app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/", defaultRouter);
app.use("/recipes", recipesRouter);
app.use("/recipesfs", recipesfsRouter);
app.use("/phoneNumber", verifyRouter);
app.use("/email", emailRouter);
app.use("/pay", payRouter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

mongoose.connection.once("connected", () => {
  console.log("connected to DB ! !!");
});
mongoose.connection.on("error", (err) => {
  console.error("error connecting", err);
});

app.listen(port, () => console.log(`connected on port ${port}`));
