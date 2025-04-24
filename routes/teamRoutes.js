const express = require("express");
const router = express.Router();
const { updateTeamController } = require("../controllers/teamController");
const { createTeamController } = require("../controllers/teamController");
const { deleteTeamController } = require("../controllers/teamController");
const { getTeamController } = require("../controllers/teamController");
const { getAllTeamsController } = require("../controllers/teamController");
const { getTeamsByClubController } = require("../controllers/teamController");

// Create a team
router.post("/", createTeamController);

// Update a team
router.put("/:id", updateTeamController);

// Delete a team
router.delete("/:id", deleteTeamController);

// Get a single team
router.get("/:id", getTeamController);

// Get all teams
router.get("/", getAllTeamsController);

// Get all teams in a club
router.get("/club/:clubId", getTeamsByClubController);

module.exports = router;
