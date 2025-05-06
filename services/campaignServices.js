const Campaign = require("../models/campaignModel");

exports.createCampaign = async (data) => {
  return await Campaign.create(data);
};

exports.updateCampaign = async (id, data) => {
  const campaign = await Campaign.findByIdAndUpdate(id, data, { new: true });
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
};

exports.getCampaignById = async (id) => {
  const campaign = await Campaign.findById(id).populate("sponsors");
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
};

exports.getAllCampaignsByClub = async (clubId) => {
  return await Campaign.find({ club: clubId }).populate("sponsors");
};

exports.deleteCampaign = async (id) => {
  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) throw new Error("Campaign not found or already deleted");
  return campaign;
};
