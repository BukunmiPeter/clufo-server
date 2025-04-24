const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ageRange: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => arr.length === 2 && arr[0] <= arr[1],
        message:
          "Age range must be an array of two numbers in ascending order.",
      },
    },
    mainTeam: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
    publicDisplayName: { type: String, required: true },
    coach: { type: String },
    manager: { type: String },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
