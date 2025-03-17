const crypto = require("crypto");

const User = require("../models/userModel");
const { sendVerificationEmail } = require("../utils/emailServiceUtil");

// Service to verify user by code
const verifyUserService = async (code) => {
  const user = await User.findOne({ verificationCode: code });

  if (!user) {
    return { success: false, message: "Invalid or expired verification code." };
  }

  user.verified = true;
  user.verificationCode = null;
  await user.save();

  return { success: true, message: "Email verified successfully!" };
};

// Service to resend verification email
const resendVerificationService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found." };
  }

  if (user.verified) {
    return { success: false, message: "User is already verified." };
  }

  const newCode = crypto.randomBytes(20).toString("hex");
  user.verificationCode = newCode;
  await user.save();

  await sendVerificationEmail(email, newCode);

  return { success: true, message: "Verification email resent successfully." };
};

module.exports = { verifyUserService, resendVerificationService };
