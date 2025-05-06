const express = require("express");
const router = express.Router();
const pipelineController = require("../controllers/pipelineController");

router.post("/", pipelineController.createPipeline);
router.get("/club/:clubId", pipelineController.getPipelineByClub);
router.put("/move-sponsor", pipelineController.moveSponsorStage);
router.delete("/:id", pipelineController.deletePipeline);

module.exports = router;
