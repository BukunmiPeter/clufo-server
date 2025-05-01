const VolunteerJob = require("../models/volunteerJobModel");

exports.createVolunteerJob = async (data) => {
  return await VolunteerJob.create(data);
};

exports.getAllVolunteerJobs = async (status) => {
  const filter = status ? { status } : {};
  return await VolunteerJob.find(filter).populate("volunteers");
};

exports.updateVolunteerJob = async (id, data) => {
  return await VolunteerJob.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteVolunteerJob = async (id) => {
  return await VolunteerJob.findByIdAndDelete(id);
};
