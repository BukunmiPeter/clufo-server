const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
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
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows flexible values
  },
});

module.exports = mongoose.model("Member", memberSchema);
