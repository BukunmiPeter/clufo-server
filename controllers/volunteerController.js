const volunteerService = require("../services/volunteerService");
exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.createVolunteer(req.body);
    res.status(201).json({
      success: true,
      message: "Volunteer created successfully",
      data: volunteer,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await volunteerService.getAllVolunteers();
    res.json({
      success: true,
      message: "Volunteers retrieved successfully",
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve volunteers",
      data: null,
      error: error.message,
    });
  }
};
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await volunteerService.getVolunteerById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
        data: null,
      });
    }
    res.json({
      success: true,
      message: "Volunteer retrieved successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve volunteer",
      data: null,
      error: error.message,
    });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVolunteer = await volunteerService.updateVolunteer(
      id,
      req.body
    );

    if (!updatedVolunteer) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: updatedVolunteer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    await volunteerService.deleteVolunteer(req.params.id);
    res.json({
      success: true,
      message: "Volunteer deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete volunteer",
      data: null,
      error: error.message,
    });
  }
};
