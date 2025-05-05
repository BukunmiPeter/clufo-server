const express = require("express");
const {
  createSubteamController,
  updateSubteamController,
  deleteSubteamController,
  getSubteamController,
  getSubteamsByMainTeamController,
} = require("../controllers/subteamController");
const router = express.Router();

router.post("/", createSubteamController);

router.put("/:id", updateSubteamController);

router.delete("/:id", deleteSubteamController);

router.get("/:id", getSubteamController);

router.get("/team/:mainTeamId", getSubteamsByMainTeamController);

module.exports = router;
