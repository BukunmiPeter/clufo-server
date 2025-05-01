const Volunteer = require("../models/volunteerModel");

exports.createVolunteer = async (data) => {
  return await Volunteer.create(data);
};
exports.getAllVolunteers = async () => {
  return await Volunteer.find();
};

exports.getVolunteerById = async (id) => {
  return await Volunteer.findById(id);
};

exports.deleteVolunteer = async (id) => {
  return await Volunteer.findByIdAndDelete(id);
};
