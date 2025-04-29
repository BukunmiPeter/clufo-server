const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameNormalized: {
      type: String,
      required: true,
    },
    ageRange: [Number],
    mainTeam: String,
    publicDisplayName: String,
    coach: String,
    manager: String,
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  { timestamps: true }
);

// Create a unique index on normalized name + club
teamSchema.index({ nameNormalized: 1, club: 1 }, { unique: true });

// Always set nameNormalized before saving
teamSchema.pre("save", function (next) {
  this.nameNormalized = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model("Team", teamSchema);
