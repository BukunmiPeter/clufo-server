const Club = require("../models/clubModel");
const Sponsor = require("../models/sponsorModel");

exports.createSponsor = async (data) => {
  const { club, name, ...sponsorData } = data;

  const existingClub = await Club.findById(club);
  if (!existingClub) {
    throw new Error("Club not found");
  }

  const nameNormalized = name.toLowerCase();

  const existingSponsor = await Sponsor.findOne({ club, nameNormalized });
  if (existingSponsor) {
    throw new Error("A Sponsor with this name already exists in the club.");
  }

  const sponsor = new Sponsor({
    ...sponsorData,
    name,
    nameNormalized,
    club,
  });

  return await sponsor.save();
};

exports.getSponsors = async (clubId) => {
  return await Sponsor.find({ club: clubId, lead: false });
};

exports.getLeads = async (clubId) => {
  return await Sponsor.find({ club: clubId, lead: true });
};

exports.getSponsorById = async (id) => {
  return await Sponsor.findById(id).populate("campaign");
};

exports.updateSponsor = async (id, data) => {
  return await Sponsor.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSponsor = async (id) => {
  return await Sponsor.findByIdAndDelete(id);
};
