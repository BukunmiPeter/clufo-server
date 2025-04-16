const express = require("express");
const {
  signup,
  login,
  verifyUser,
  resendVerification,
  requestReset,
  verifyResetCode,
  resetUserPassword,
  logoutUser,
  refreshTokenController,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenController);
router.post("/verify-email", verifyUser);
router.post("/resend-verification", resendVerification);
router.post("/request-reset", requestReset);
router.post("/verify-reset", verifyResetCode);
router.post("/reset-password", resetUserPassword);

module.exports = router;
