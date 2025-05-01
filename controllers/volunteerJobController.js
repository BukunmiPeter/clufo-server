const volunteerJobService = require("../services/volunteerJobService");

exports.createVolunteerJob = async (req, res) => {
  try {
    const job = await volunteerJobService.createVolunteerJob(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllVolunteerJobs = async (req, res) => {
  const jobs = await volunteerJobService.getAllVolunteerJobs(req.query.status);
  res.json(jobs);
};

exports.updateVolunteerJob = async (req, res) => {
  const job = await volunteerJobService.updateVolunteerJob(
    req.params.id,
    req.body
  );
  res.json(job);
};

exports.deleteVolunteerJob = async (req, res) => {
  await volunteerJobService.deleteVolunteerJob(req.params.id);
  res.json({ message: "Volunteer job deleted" });
};
