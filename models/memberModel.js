const mongoose = require("mongoose");

const StatusEnum = ["awaiting", "active", "probation", "onboarding"];

const memberSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Added adminId
  clubname: { type: String, required: true },
  playerPic: String,
  firstName: String,
  lastName: String,
  dob: String,
  nationality: String,
  gender: String,
  phoneNo: String,
  socialSecurityNo: String,
  Iban: String,
  email: { type: String, unique: true },
  fatherName: String,
  fatherContactNo: String,
  motherName: String,
  motherContactNo: String,
  primaryContact: String,
  emergencyContact1Name: String,
  emergencyContact1No: String,
  emergencyContact2Name: String,
  emergencyContact2No: String,
  correspondenceAddress1: String,
  correspondenceAddress2: String,
  correspondenceCity: String,
  correspondenceZipcode: String,
  correspondenceCountry: String,
  billingAddress1: String,
  billingAddress2: String,
  billingCity: String,
  billingZipcode: String,
  billingCountry: String,
  playerPosition: String,
  team: String,
  membershipType: String,
  membershipExpiryDate: String,
  paymentStat: String,
  invited: {
    type: Boolean,
    default: false,
  },
  inviteCode: { type: String, default: null },
  status: {
    type: String,
    enum: StatusEnum,
    default: "awaiting",
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows flexible values
  },
});

module.exports = mongoose.model("Member", memberSchema);
