const volunteerService = require("../services/volunteerService");
exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.createVolunteer(req.body);
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllVolunteers = async (req, res) => {
  const volunteers = await volunteerService.getAllVolunteers();
  res.json(volunteers);
};

exports.getVolunteerById = async (req, res) => {
  const volunteer = await volunteerService.getVolunteerById(req.params.id);
  if (!volunteer) return res.status(404).json({ error: "Volunteer not found" });
  res.json(volunteer);
};

exports.deleteVolunteer = async (req, res) => {
  await volunteerService.deleteVolunteer(req.params.id);
  res.json({ message: "Volunteer deleted" });
};
