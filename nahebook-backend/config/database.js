require("dotenv").config();
const mongoose = require("mongoose");

//Setup mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

const connection = async () => {
  await mongoose.connect(mongoDB);
};

connection().catch((err) => console.log(err));
