const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameNormalized: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "finished"],
      default: "pending",
    },
    packageLevel: { type: String },
    contractPeriod: { type: [Date], validate: (arr) => arr.length === 2 },
    logo: { type: String },
    industry: { type: String },
    phoneNumber: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    contactPersonName: { type: String },
    contactPersonPhone: { type: String },
    contactPersonEmail: { type: String },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    remarks: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial payment", "draft"],
      default: "unpaid",
    },
    inventory: { type: [String], default: [] },
    totalSponsoredAmount: { type: Number, default: 0 },
    campaign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    tags: { type: [String], default: [] },

    leadStage: {
      type: String,
      enum: ["contacted", "negotiating", "won", "loss"],
      default: "contacted",
    },
    lead: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sponsor", sponsorSchema);
