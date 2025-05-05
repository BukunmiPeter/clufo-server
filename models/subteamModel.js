const mongoose = require("mongoose");

const subteamSchema = new mongoose.Schema(
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

    publicDisplayName: String,
    coach: String,
    manager: String,

    mainTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  },
  { timestamps: true }
);

// Create a unique index on normalized name + club
subteamSchema.index({ nameNormalized: 1, club: 1 }, { unique: true });

// Always set nameNormalized before saving
subteamSchema.pre("save", function (next) {
  this.nameNormalized = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model("Subteam", subteamSchema);
