const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authUser = require("./routes/authRoute");
require("dotenv").config();

//middleware json
app.use(express.json());

//auth routes
app.use("/api/users", authUser);

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
