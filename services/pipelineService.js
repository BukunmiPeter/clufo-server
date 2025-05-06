const Pipeline = require("../models/pipelineModel");
const Sponsor = require("../models/sponsorModel");

exports.createPipeline = async (data) => {
  return await Pipeline.create(data);
};

exports.createPipeline = async (data) => {
  const stages = ["pitched", "negotiation", "agreed", "signed", "lost"];
  const stageData = {};

  for (const stage of stages) {
    const sponsorIds = data[stage]?.sponsors || [];

    const sponsors = await Sponsor.find({ _id: { $in: sponsorIds } });

    const amount = sponsors.reduce((sum, sponsor) => {
      return sum + (sponsor.totalSponsoredAmount || 0);
    }, 0);

    stageData[stage] = {
      sponsors: sponsorIds,
      amount,
    };
  }

  return await Pipeline.create({
    club: data.club,
    ...stageData,
  });
};

exports.moveSponsorStage = async ({
  clubId,
  sponsorId,
  fromStage,
  toStage,
}) => {
  const pipeline = await Pipeline.findOne({ club: clubId });
  if (!pipeline) throw new Error("Pipeline not found");

  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) throw new Error("Sponsor not found");

  const sponsorAmount = sponsor.totalSponsoredAmount || 0;

  // Remove sponsor from previous stage
  if (pipeline[fromStage]) {
    pipeline[fromStage].sponsors = pipeline[fromStage].sponsors.filter(
      (id) => id.toString() !== sponsorId
    );
  }

  // Add sponsor to new stage
  if (!pipeline[toStage]) {
    pipeline[toStage] = { sponsors: [], amount: 0 };
  }

  if (!pipeline[toStage].sponsors.includes(sponsorId)) {
    pipeline[toStage].sponsors.push(sponsorId);
  }

  // Recalculate amount for all stages
  const recalculateStageAmount = async (stage) => {
    const sponsorDocs = await Sponsor.find({
      _id: { $in: pipeline[stage].sponsors },
    });
    pipeline[stage].amount = sponsorDocs.reduce(
      (sum, s) => sum + (s.totalSponsoredAmount || 0),
      0
    );
  };

  await recalculateStageAmount(fromStage);
  await recalculateStageAmount(toStage);

  await pipeline.save();
  return pipeline;
};
exports.addSponsorToStage = async (clubId, sponsorId, stage) => {
  let pipeline = await Pipeline.findOne({ club: clubId });
  if (!pipeline) {
    // Create new pipeline if it doesn't exist
    pipeline = await Pipeline.create({
      club: clubId,
      [stage]: { sponsors: [sponsorId], amount: 0 },
    });
  }

  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) throw new Error("Sponsor not found");

  if (!pipeline[stage]) {
    pipeline[stage] = { sponsors: [], amount: 0 };
  }

  if (!pipeline[stage].sponsors.includes(sponsorId)) {
    pipeline[stage].sponsors.push(sponsorId);
  }

  const sponsorDocs = await Sponsor.find({
    _id: { $in: pipeline[stage].sponsors },
  });
  pipeline[stage].amount = sponsorDocs.reduce(
    (sum, s) => sum + (s.totalSponsoredAmount || 0),
    0
  );

  await pipeline.save();
  return pipeline;
};
exports.deletePipeline = async (id) => {
  return await Pipeline.findByIdAndDelete(id);
};
