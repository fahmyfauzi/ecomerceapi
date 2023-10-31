const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const { verifyTokenAndAdmin } = require("./verifyToken");

//tambah product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  //tangkap product dari body
  const newProduct = new Product(req.body);
  try {
    //save product
    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
