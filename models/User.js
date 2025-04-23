const mongoose = require("mongoose");

// Define a Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  unitNumber: String,
  password: String,
  phoneNumber: Number,
});

module.exports = mongoose.model("User", userSchema);
