const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    campaignName: { type: String, required: true },
    campaignBudget: { type: Number, default: 0 },
    eventDate: { type: Date, required: true },
    closingDate: { type: Date, required: true },
    sponsors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsor",
      },
    ],
    remarks: { type: String },
    stage: {
      type: String,
      enum: ["planning", "ongoing", "completed", "cancelled"],
      default: "planning",
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
