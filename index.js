const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authUser = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
require("dotenv").config();

//middleware json
app.use(express.json());

//auth routes
app.use("/api/auth", authUser);

//user route
app.use("/api/users", userRoute);

//product route
app.use("/api/products", productRoute);

//cart route
app.use("/api/carts", cartRoute);

//order route
app.use("/api/orders", orderRoute);

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
