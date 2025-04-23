const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import your User Mongoose model
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Routes

// GET all users
router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single user by ID
router.get("/getUserById/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, unitNumber, password, phoneNumber } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      unitNumber: req.body.unitNumber,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an user by ID
router.put("/deleteUserById/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      new mongoose.Types.ObjectId(req.params.id.toString())
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Login API
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        unitNumber: user.unitNumber,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
