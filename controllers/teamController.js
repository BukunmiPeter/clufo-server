const { deleteTeam } = require("../services/teamService");
const { getAllTeams } = require("../services/teamService");
const { getTeamsByClub } = require("../services/teamService");
const { getTeamById } = require("../services/teamService");
const { createTeam } = require("../services/teamService");
const { updateTeam } = require("../services/teamService");

const createTeamController = async (req, res) => {
  try {
    const team = await createTeam(req.body);
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeamController = async (req, res) => {
  try {
    const team = await updateTeam(req.params.id, req.body);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTeamController = async (req, res) => {
  try {
    const team = await deleteTeam(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeamController = async (req, res) => {
  try {
    const team = await getTeamById(req.params.id);
    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTeamsController = async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeamsByClubController = async (req, res) => {
  try {
    const teams = await getTeamsByClub(req.params.clubId);
    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTeamController,
  updateTeamController,
  getTeamController,
  deleteTeamController,
  getAllTeamsController,
  getTeamsByClubController,
};
