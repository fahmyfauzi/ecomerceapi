const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
  //tangkap product dari body
  const newCart = new Cart(req.body);
  try {
    //save product
    const savedCart = await newCart.save();
    return res.status(201).json(savedCart);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
