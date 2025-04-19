const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const crypto = require("crypto");
const {
  sendVerificationEmail,
} = require("../utils/emailFunctions/VerifyAccountEmail.js");
const {
  sendResetPasswordEmail,
} = require("../utils/emailFunctions/resetCodeEmail.js");
const {
  generateRandomSixDigitCode,
} = require("../utils/generateSixDigitCode.js");

const signupUser = async ({ fullName, email, clubname, password }) => {
  try {
    const lowercaseClubname = clubname.toLowerCase();

    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail)
      throw new Error("User with this email already exists");

    const clubnameExists = await User.findOne({
      clubname: { $regex: new RegExp(`^${lowercaseClubname}$`, "i") },
    });
    if (clubnameExists) throw new Error("This clubname is already taken");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateRandomSixDigitCode();

    const emailSent = await sendVerificationEmail(email, verificationCode);
    if (!emailSent || emailSent.message !== "Queued. Thank you.") {
      throw new Error("Verification email could not be sent");
    }

    const user = await User.create({
      fullName,
      email,
      clubname: lowercaseClubname,
      password: hashedPassword,
      verificationCode,
    });

    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.role,
      "both"
    );

    return {
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        userId: user._id,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    return { success: false, message: error.message || "Signup failed" };
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const { password: _, verified, ...otherProps } = user.toObject();

    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.role,
      "both"
    );

    return {
      success: true,
      message: "Sign in successful",
      data: { ...otherProps, verified, accessToken, refreshToken },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

const refreshAccessTokenService = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    if (!refreshToken) {
      return reject(new Error("No refresh token provided"));
    }

    // Clean and check the token format
    const cleanedToken = refreshToken.trim();

    // Verify the refresh token
    jwt.verify(
      cleanedToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error("❌ JWT verification error:", err.message);

          // Check if the token is expired
          if (err.name === "TokenExpiredError") {
            return reject(new Error("Refresh token expired"));
          }

          return reject(new Error("Invalid or malformed refresh token"));
        }

        // console.log("🔐 Decoded JWT:", decoded);

        if (!decoded || !decoded.id || !decoded.role) {
          return reject(new Error("Invalid refresh token payload"));
        }

        // Check if the token is expired manually (in case you want to check it independently)
        const isTokenExpired = Date.now() / 1000 > decoded.exp;
        if (isTokenExpired) {
          return reject(new Error("Refresh token expired"));
        }

        try {
          const user = await User.findById(decoded.id);
          if (!user) {
            return reject(new Error("User not found"));
          }

          // Generate new access token
          const newAccessToken = generateTokens(user._id, user.role, "access");
          console.log(newAccessToken.accessToken, "new");
          resolve(newAccessToken.accessToken);
        } catch (err) {
          reject(new Error("Error fetching user or generating new token"));
        }
      }
    );
  });
};

const logoutService = async (req) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    // No DB actions needed — we just remove the cookie
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    throw new Error(error.message || "Logout failed");
  }
};
// Token Generator
const generateTokens = (userId, role, type) => {
  const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });

  let refreshToken = null;
  if (type === "both" || type === "refresh") {
    refreshToken = jwt.sign(
      { id: userId, role },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d", // Set expiration for refresh token
      }
    );
  }

  return { accessToken, refreshToken };
};
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found." };
  }
  const resetCode = generateRandomSixDigitCode();
  const emailSent = await sendResetPasswordEmail(email, resetCode);

  if (!emailSent || emailSent.message !== "Queued. Thank you.") {
    console.error("❌ Failed to send reset email for:", email, emailSent);
    throw new Error("Reset email could not be sent");
  } else {
    console.log("✅ V");
  }
  // Generate a unique reset code

  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 3600000; // Code expires in 1 hour

  await user.save();

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
  generateTokens,
  refreshAccessTokenService,
  logoutService,
  loginUser,
  requestPasswordReset,
  verifyResetEmailRequest,
  resetPassword,
};
