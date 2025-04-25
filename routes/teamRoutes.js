const express = require("express");
const router = express.Router();
const { updateTeamController } = require("../controllers/teamController");
const { createTeamController } = require("../controllers/teamController");
const { deleteTeamController } = require("../controllers/teamController");
const { getTeamController } = require("../controllers/teamController");
const { getAllTeamsController } = require("../controllers/teamController");
const { getTeamsByClubController } = require("../controllers/teamController");

router.post("/", createTeamController);

router.put("/:id", updateTeamController);

router.delete("/:id", deleteTeamController);

router.get("/:id", getTeamController);

router.get("/", getAllTeamsController);

router.get("/club/:clubId", getTeamsByClubController);

module.exports = router;
