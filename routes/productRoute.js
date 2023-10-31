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
router.get("/find/:id", async (req, res) => {
  try {
    //cari product berdasar id
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get all products
router.get("/", async (req, res) => {
  //tangkap query new
  const qnew = req.query.new;
  const qcategory = req.query.category;
  try {
    let products;
    if (qnew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qcategory) {
      products = await Product.find({
        categories: {
          $in: [qcategory],
        },
      });
    } else {
      products = Product.find();
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    return res.status(200).json("Product has been deleted...");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

module.exports = router;
