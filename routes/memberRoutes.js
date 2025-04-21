const express = require("express");
const {
  addMemberController,
  updateMemberController,
  deleteMemberController,
  getMemberController,
  getAllMembersController,
  inviteMemberController,
  signupInvitedMemberController,
  uploadFileController,
} = require("../controllers/memberController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { upload } = require("../services/memberService");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/members", adminMiddleware, addMemberController);
router.post("/invite-member", adminMiddleware, inviteMemberController);
router.post("/signup-invited", signupInvitedMemberController);

router.put("/members/:id", adminMiddleware, updateMemberController);
router.delete("/members/:id", adminMiddleware, deleteMemberController);
router.get("/members", adminMiddleware, getAllMembersController);
router.get("/members/:id", authMiddleware, getMemberController);
router.post(
  "/upload",
  adminMiddleware,

  upload.single("file"),
  uploadFileController
);

module.exports = router;
