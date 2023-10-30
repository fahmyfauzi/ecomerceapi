const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const cryptoJs = require("crypto-js");

//register user
router.post("/register", async (req, res) => {
  //create user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASS
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
