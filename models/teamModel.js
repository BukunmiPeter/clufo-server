const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, unique: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }], // Referencing the Member model
    // You can add other team-specific fields here, like:
    // coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // league: { type: String },
    // dateCreated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
