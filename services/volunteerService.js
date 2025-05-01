const Volunteer = require("../models/volunteerModel");

exports.createVolunteer = async (data) => {
  const { email } = data;

  // Check if volunteer with email already exists
  const existing = await Volunteer.findOne({ email });
  if (existing) {
    throw new Error(`Volunteer already exists`);
  }

  // Create new volunteer
  return await Volunteer.create(data);
};
exports.getAllVolunteers = async () => {
  return await Volunteer.find();
};

exports.getVolunteerById = async (id) => {
  return await Volunteer.findById(id);
};

exports.updateVolunteer = (id, updateData) => {
  return Volunteer.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteVolunteer = async (id) => {
  return await Volunteer.findByIdAndDelete(id);
};
