const Campaign = require("../models/campaignModel");

exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!campaign)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "sponsors"
    );
    if (!campaign)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllCampaignsByClub = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ club: req.params.clubId }).populate(
      "sponsors"
    );
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const result = await Campaign.findByIdAndDelete(req.params.id);
    if (!result)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
