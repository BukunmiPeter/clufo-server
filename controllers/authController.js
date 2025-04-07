const {
  signupUser,
  loginUser,
  requestPasswordReset,
  verifyResetEmailRequest,
  resetPassword,
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
    const result = await loginUser(req.body);

    if (!result.success) {
      return res.status(400).json(result); // Return 400 for failed login
    }

    return res.status(200).json(result); // 200 for successful login
  } catch (error) {
    console.error("Unexpected login error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
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
  verifyUser,
  resendVerification,
  requestReset,
  verifyResetCode,
  resetUserPassword,
};
