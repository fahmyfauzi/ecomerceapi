const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
  //tangkap order dari body
  const newOrder = new Order(req.body);
  try {
    //save order
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndRemove(req.params.id);
    return res.status(200).json("Order has been deleted...");
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get user order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.params.userId });
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.find();
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  // Membuat objek Date yang mewakili tanggal saat ini.
  const date = new Date();
  // Mengambil tanggal satu bulan yang lalu dari saat ini.
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  // Mengambil tanggal dua bulan yang lalu dari saat ini.
  const previousMonth = new Date().setMonth(lastMonth.getMonth() - 1);

  try {
    // Menggunakan agregasi (aggregation) MongoDB untuk menghitung statistik pendapatan.
    const income = await Order.aggregate([
      // Tahap pertama: Memfilter pesanan yang dibuat dalam dua bulan terakhir.
      { $match: { createadAt: { $gte: previousMonth } } },
      // Tahap kedua: Mengubah data pesanan untuk proyeksi bulan pembuatan dan jumlah penjualan (amount).
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      // Tahap ketiga: Mengelompokkan pesanan berdasarkan bulan pembuatan.
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    return res.status(200).json(income);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});
module.exports = router;
