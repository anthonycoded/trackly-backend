const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "secret_key");

    res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  //get email from req body
  const { email, password } = req.body;
  console.log(req.body);

  //No email or password entered
  if (!email || !password) {
    return res.status(422).send({
      error: "Must provide email and password",
    });
  }

  //Find user by email
  const user = await User.findOne({ email });

  //No user found
  if (!user) {
    return res.status(422).send({ error: "Invalid email or password" });
  }

  try {
    //Compare Passwords
    await user.comparePassword(password);

    //Create and send new JWt
    const token = jwt.sign({ userId: user.id }, "secret_key");
    res.send({ token });
  } catch (error) {
    //invalid email or password
    return res.status(422).send({ error: "Invalid email or password" });
  }
});

module.exports = router;
