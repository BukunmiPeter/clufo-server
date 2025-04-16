const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clubname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["user", "admin"] },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    resetPasswordCode: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    // teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
