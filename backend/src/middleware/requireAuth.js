const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = (req, res, next) => {
  //Get auth header
  const { authorization } = req.headers;
  // authorization === Bearer neiuhveru

  if (!authorization) {
    return res.status(401).send({ error: "you must be logged in" });
  }

  //Remove "bearer" from Token
  const token = authorization.replace("Bearer ", "");

  ///Validate Token
  jwt.verify(token, "secret_key", async (err, payload) => {
    //Bad token
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }

    //Get user id fromm payload
    const { userId } = payload;

    //Get user object from database
    const user = await User.findById(userId);

    req.user = user;
    next();
  });
};
