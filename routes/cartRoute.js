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

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Cart.findByIdAndRemove(req.params.id);
    return res.status(200).json("Cart has been deleted...");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});
module.exports = router;
