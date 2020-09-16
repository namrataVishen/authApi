const mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: "token can't be empty",
  }
});

mongoose.model("Token", tokenSchema);
