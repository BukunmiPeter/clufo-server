const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    skills: { type: [String], default: [] },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
