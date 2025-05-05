const Subteam = require("../models/subTeamModel");
const Team = require("../models/teamModel");

const createSubteam = async (data) => {
  const { mainTeam, name, ...subteamData } = data;

  const existingTeam = await Team.findById(mainTeam);
  if (!existingTeam) {
    throw new Error("Team not found");
  }

  const nameNormalized = name.toLowerCase();

  const existingSubteam = await Team.findOne({
    mainTeam,
    nameNormalized,
  });

  if (existingSubteam) {
    throw new Error("A subteam with this name already exists in the Team.");
  }

  return await Subteam.create({
    ...subteamData,
    name,
    nameNormalized,
    mainTeam,
  });
};

const updateSubteam = async (id, data) => {
  return await Subteam.findByIdAndUpdate(id, data, { new: true });
};

const deleteSubteam = async (id) => {
  return await Subteam.findByIdAndDelete(id);
};

const getSubteamById = async (id) => {
  return await Subteam.findById(id).populate("mainTeam");
};

const getSubteamsByMainTeam = async (mainTeamId) => {
  console.log("ddf", mainTeamId);
  return await Subteam.find({ mainTeam: mainTeamId });
};

module.exports = {
  createSubteam,
  updateSubteam,
  deleteSubteam,
  getSubteamById,
  getSubteamsByMainTeam,
};
