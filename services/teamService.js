const Club = require("../models/clubModel");
const Team = require("../models/teamModel");

const createTeam = async (data) => {
  const { club, ...teamData } = data;

  const existingClub = await Club.findById(club);
  if (!existingClub) {
    throw new Error("Club not found");
  }

  return await Team.create({ ...teamData, club });
};

const updateTeam = async (id, data) => {
  return await Team.findByIdAndUpdate(id, data, { new: true });
};

const deleteTeam = async (id) => {
  return await Team.findByIdAndDelete(id);
};

const getTeamById = async (id) => {
  return await Team.findById(id).populate("club");
};

const getAllTeams = async () => {
  return await Team.find().populate("club");
};

const getTeamsByClub = async (clubId) => {
  return await Team.find({ club: clubId });
};

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
  getAllTeams,
  getTeamsByClub,
};
