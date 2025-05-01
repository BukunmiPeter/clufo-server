const Volunteer = require("../models/volunteerModel");

export const createVolunteer = async (data) => {
  return await Volunteer.create(data);
};

export const getAllVolunteers = async () => {
  return await Volunteer.find();
};

export const getVolunteerById = async (id) => {
  return await Volunteer.findById(id);
};

export const deleteVolunteer = async (id) => {
  return await Volunteer.findByIdAndDelete(id);
};
