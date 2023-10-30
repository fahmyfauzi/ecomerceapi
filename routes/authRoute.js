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

//login user
router.post("/login", async (req, res) => {
  try {
    //cari user berdasarkan nama
    const user = await User.findOne({ username: req.body.username });

    //jika bukan user dan response status 401
    !user && res.status(401).json("Wrong credentials!");

    //decrypt password cryptoJs
    const hashedPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_PASS
    );
    const originalPassword = hashedPassword.toString(cryptoJs.enc.Utf8);

    //jika password tidak sama dengan password yang dikirim dan response status 401
    originalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
