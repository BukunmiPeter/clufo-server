const {
  createSubteam,
  getSubteamById,
  updateSubteam,
  deleteSubteam,
  getSubteamsByMainTeam,
} = require("../services/subteamService");

const createSubteamController = async (req, res) => {
  try {
    const subteam = await createSubteam(req.body);
    res.status(201).json({
      success: true,
      message: "Subteam created successfully",
      data: subteam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateSubteamController = async (req, res) => {
  try {
    const subteam = await updateSubteam(req.params.id, req.body);
    if (!subteam) {
      return res
        .status(404)
        .json({ success: false, message: "Subteam not found" });
    }
    res.json({
      success: true,
      message: "Subteam updated successfully",
      data: subteam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Subteam
const deleteSubteamController = async (req, res) => {
  try {
    const subteam = await deleteSubteam(req.params.id);
    if (!subteam) {
      return res
        .status(404)
        .json({ success: false, message: "Subteam not found" });
    }
    res.json({ success: true, message: "Subteam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subteam by ID
const getSubteamController = async (req, res) => {
  try {
    const subteam = await getSubteamById(req.params.id);
    if (!subteam) {
      return res
        .status(404)
        .json({ success: false, message: "Subteam not found" });
    }
    res.json({
      success: true,
      message: "Subteam fetched successfully",
      data: subteam,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Subteams by Main Team
const getSubteamsByMainTeamController = async (req, res) => {
  try {
    const subteams = await getSubteamsByMainTeam(req.params.mainTeamId);
    res.json({
      success: true,
      message: "Subteams fetched successfully",
      data: subteams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createSubteamController,
  updateSubteamController,
  getSubteamController,
  deleteSubteamController,
  getSubteamsByMainTeamController,
};
