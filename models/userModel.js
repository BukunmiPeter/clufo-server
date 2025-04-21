const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["user", "admin"] },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    resetPasswordCode: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
