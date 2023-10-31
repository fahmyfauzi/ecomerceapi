const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const cryptoJs = require("crypto-js");
const router = express.Router();
const User = require("../models/userModel");

//update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //jika body ada password
  if (req.body.password) {
    //harus di encrypt dulu sebelum diupdate
    req.body.password = cryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    //cari user berdasar id
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    //tangkap query new
    const query = req.query.new;
    //cari user berdasar id
    const user = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
