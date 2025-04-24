const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const usersRouter = require("./routes/users");
var cors = require("cors");
const User = require("./models/User"); // Import the schema
// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    await User.syncIndexes(); // <-- Ensure indexes are in sync (unique constraints)
    console.log("Indexes synced");
  } catch (error) {
    console.error("Error syncing indexes:", error);
  }
});

// Middleware
app.use(bodyParser.json());

//Cors
app.use(cors());

//Invoke routes

app.use("/user", usersRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
