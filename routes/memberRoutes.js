const express = require("express");
const {
  addMemberController,
  updateMemberController,
  deleteMemberController,
  getMemberController,
  getAllMembersController,
} = require("../controllers/memberController");

const router = express.Router();

router.post("/members", addMemberController);
router.put("/members/:id", updateMemberController);
router.delete("/members/:id", deleteMemberController);
router.get("/members", getAllMembersController);
router.get("/members/:id", getMemberController);
router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.send("Test route working!");
});

module.exports = router;
