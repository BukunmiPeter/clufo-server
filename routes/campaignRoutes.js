const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");

router.post("/", campaignController.createCampaign);
router.put("/:id", campaignController.updateCampaign);
router.get("/:id", campaignController.getCampaign);
router.get("/club/:clubId", campaignController.getAllCampaignsByClub);
router.delete("/:id", campaignController.deleteCampaign);

module.exports = router;
