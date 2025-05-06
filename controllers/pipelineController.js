const pipelineService = require("../services/pipelineService");

exports.createPipeline = async (req, res) => {
  try {
    const pipeline = await pipelineService.createPipeline(req.body);
    res.status(201).json({ success: true, data: pipeline });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getPipelineByClub = async (req, res) => {
  try {
    const pipeline = await pipelineService.getPipelineByClub(req.params.clubId);
    res.json({ success: true, data: pipeline });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.moveSponsorStage = async (req, res) => {
  try {
    const pipeline = await pipelineService.moveSponsorStage(req.body);
    res.json({ success: true, data: pipeline });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePipeline = async (req, res) => {
  try {
    await pipelineService.deletePipeline(req.params.id);
    res.json({ success: true, message: "Pipeline deleted" });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
