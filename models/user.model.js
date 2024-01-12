//import mongoose
const mongoose = require("mongoose");

//route handler
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `NOT PROVIDED 😒`],
  },
  userId: {
    type: String,
    required: [true, `NOT PROVIDED 😕`],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, `NOT PROVIDED 🙁`],
  },
  email: {
    type: String,
    required: [true, `NOT PROVIDED 😠`],
    lowercase: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

//export
module.exports = mongoose.model("User", userSchema);
