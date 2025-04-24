const {
  signupUser,
  loginUser,
  requestPasswordReset,
  verifyResetEmailRequest,
  resetPassword,
  logoutService,
  refreshAccessTokenService,
} = require("../services/authService.js");
const {
  verifyUserService,
  resendVerificationService,
} = require("../services/verifyEmailService.js");

const signup = async (req, res) => {
  try {
    const result = await signupUser(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result); // 201 for successful creation
  } catch (error) {
    console.error("Unexpected signup error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set refreshToken in cookie
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Only return accessToken + user data (don't include refreshToken in response body)
    const {
      verificationCode,
      resetPasswordCode,
      resetPasswordExpires,
      ...responseData
    } = result.data;

    return res.status(200).json({
      success: true,
      message: "Sign in successful",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token provided in cookies",
      });
    }

    const newAccessToken = await refreshAccessTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return res.status(403).json({
      success: false,
      message: error.message || "Failed to refresh token",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await logoutService(req); // handles validation and logic

    // Only controller touches res
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // use false locally
      sameSite: "lax",
      path: "/", // MUST match how it was originally set
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

const verifyUser = async (req, res) => {
  const { code } = req.body;

  try {
    const result = await verifyUserService(code);
    const status = result.success ? 200 : 400;
    res.status(status).json(result);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
};
const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await resendVerificationService(email);
    const status = result.success ? 200 : 400;
    res.status(status).json(result);
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email.",
    });
  }
};

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res
      .status(500)
      .json({ success: false, message: "An internal server error occurred." });
  }
};
const verifyResetCode = async (req, res) => {
  try {
    const { code } = req.body;
    console.log("code", code);
    const result = await verifyResetEmailRequest(code);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return res
      .status(500)
      .json({ success: false, message: "An internal server error occurred." });
  }
};
const resetUserPassword = async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    console.log(code, newPassword, "data");
    const result = await resetPassword(code, newPassword);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error resetting password:", error);
    return res
      .status(500)
      .json({ success: false, message: "An internal server error occurred." });
  }
};

module.exports = {
  signup,
  login,
  refreshTokenController,
  logoutUser,
  verifyUser,
  resendVerification,
  requestReset,
  verifyResetCode,
  resetUserPassword,
};
