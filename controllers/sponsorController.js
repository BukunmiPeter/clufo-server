const {
  createSponsor,
  updateSponsor,
  getSponsorById,
  getSponsors,
  deleteSponsor,
  getLeads,
} = require("../services/sponsorService");

const createSponsorController = async (req, res) => {
  try {
    const sponsor = await createSponsor(req.body);
    res.status(201).json({
      success: true,
      message: "Sponsor created successfully",
      data: sponsor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSponsorController = async (req, res) => {
  try {
    const sponsor = await updateSponsor(req.params.id, req.body);
    if (!sponsor)
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });

    res.json({
      success: true,
      message: "Sponsor updated successfully",
      data: sponsor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSponsorController = async (req, res) => {
  try {
    const sponsor = await deleteSponsor(req.params.id);
    if (!sponsor)
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });

    res.json({
      success: true,
      message: "Sponsor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSponsorController = async (req, res) => {
  try {
    const sponsor = await getSponsorById(req.params.id);
    if (!sponsor)
      return res
        .status(404)
        .json({ success: false, message: "Sponsor not found" });

    res.json({
      success: true,
      message: "Sponsor fetched successfully",
      data: sponsor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSponsorsController = async (req, res) => {
  try {
    const sponsors = await getSponsors(req.params.clubId);
    res.json({
      success: true,
      message: "Sponsors fetched successfully",
      data: sponsors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLeadsController = async (req, res) => {
  try {
    const leads = await getLeads(req.params.clubId);
    res.json({
      success: true,
      message: "Sponsors fetched successfully",
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSponsorController,
  updateSponsorController,
  deleteSponsorController,
  getSponsorController,
  getAllSponsorsController,
  getAllLeadsController,
};
