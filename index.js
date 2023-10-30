const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected!"))
  .catch((err) => console.log(err));

//server
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
