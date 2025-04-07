const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const crypto = require("crypto");
const {
  sendVerificationEmail,
} = require("../utils/emailFunctions/VerifyAccountEmail.js");

const generateRandomSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const signupUser = async ({ fullName, email, password }) => {
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      throw new Error("User already exists");
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully");

    // Generate a random 6-digit verification code
    const verificationCode = generateRandomSixDigitCode();

    // Don't create the user yet, wait until email verification is successful
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent || emailSent.message !== "Queued. Thank you.") {
      console.error(
        "❌ Failed to send verification email for:",
        email,
        emailSent
      );
      throw new Error("Verification email could not be sent");
    } else {
      console.log("✅ V");
    }

    // Now that the email is successfully sent, create the user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      verificationCode,
    });

    const token = generateToken(user._id, user.role);

    return {
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: { userId: user._id, token },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: error.message || "Signup failed" };
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const { password: _, verified, ...otherProps } = user.toObject(); // Convert to plain object for safe spreading
    const token = generateToken(user._id, user.role);

    return {
      success: true,
      message: "Sign in successful",
      data: { ...otherProps, verified, token },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

// Token Generator
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found." };
  }

  // Generate a unique reset code
  const resetCode = crypto.randomBytes(20).toString("hex");
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 3600000; // Code expires in 1 hour

  await user.save();

  // Send reset link via email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${resetCode}`;

  console.log("resetcode", resetCode);
  // await sendEmail(
  //   user.email,
  //   "Password Reset Request",
  //   `Click the link to reset your password: ${resetLink}`
  // );

  return { success: true, message: "Password reset link sent to email." };
};
const verifyResetEmailRequest = async (code) => {
  const user = await User.findOne({
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return { success: false, message: "Invalid or expired reset code." };
  }

  return {
    success: true,
    message: "Code verified. Proceed with password reset.",
  };
};

const resetPassword = async (code, newPassword) => {
  const user = await User.findOne({
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return { success: false, message: "Invalid or expired reset code." };
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear reset fields
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;

  await user.save();

  return { success: true, message: "Password reset successfully." };
};

// Export functions using CommonJS
module.exports = {
  signupUser,
  loginUser,
  requestPasswordReset,
  verifyResetEmailRequest,
  resetPassword,
};
