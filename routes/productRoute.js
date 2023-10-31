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

//update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get product detail
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //cari product berdasar id
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get all products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    //tangkap query new
    const query = req.query.new;
    //cari product berdasar id
    const products = query
      ? await Product.find().sort({ _id: -1 }).limit(5)
      : await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//update product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    return res.status(200).json("Product has been deleted...");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
