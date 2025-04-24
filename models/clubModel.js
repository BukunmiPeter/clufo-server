const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for teams
clubSchema.virtual("teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "club",
});

const Club = mongoose.model("Club", clubSchema);
module.exports = Club;

// const club = await Club.findById(clubId).populate("teams");
