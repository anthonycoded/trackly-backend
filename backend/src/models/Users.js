const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Password Hash
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  //Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    //Hash Password and add salt return new hash password
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

///Password Check  candidatePassword === input password
userSchema.methods.comparePassword = function (candidatePassword) {
  //get user object
  const user = this;

  return new Promise((resolve, reject) => {
    //compare input password with hashed pw
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      //Does not match
      if (!isMatch) {
        return reject(false);
      }
      //Password correct
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
