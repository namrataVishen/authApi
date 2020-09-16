const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var userSchema2 = new mongoose.Schema({
  fullName: {
    type: String,
    required: "Full name can't be empty",
    unique: true,
  },
  //   email: {
  //     type: String,
  //     required: 'Email can\'t be empty',
  //     unique: true
  //   },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be atleast 4 character long"],
  },
  //   project:{
  //     type:String,
  //     required: 'Project can\'t be empty'
  //   },
  //   job_profile:{
  //     type:String,
  //     required: 'job_profile can\'t be empty'
  //   },
  //   role:{
  //     type:String,
  //     required: 'role can\'t be empty'
  //   },
  saltSecret: String,
});

// Events
userSchema2.pre("save", function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

// Methods
userSchema2.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema2.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

mongoose.model("User", userSchema2);
