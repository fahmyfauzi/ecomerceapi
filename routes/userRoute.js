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

module.exports = router;
