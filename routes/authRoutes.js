const express = require("express");
const {
  signup,
  login,
  verifyUser,
  resendVerification,
  requestReset,
  verifyResetCode,
  resetUserPassword,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyUser);
router.post("/resend-verification", resendVerification);
router.post("/request-reset", requestReset);
router.get("/verify-reset", verifyResetCode);
router.post("/reset-password", resetUserPassword);

module.exports = router;
