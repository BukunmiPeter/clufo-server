const VolunteerJob = require("../models/volunteerJobModel");

export const createVolunteerJob = async (data) => {
  return await VolunteerJob.create(data);
};

export const getAllVolunteerJobs = async (status) => {
  const filter = status ? { status } : {};
  return await VolunteerJob.find(filter).populate("volunteers");
};

export const updateVolunteerJob = async (id, data) => {
  return await VolunteerJob.findByIdAndUpdate(id, data, { new: true });
};

export const deleteVolunteerJob = async (id) => {
  return await VolunteerJob.findByIdAndDelete(id);
};
