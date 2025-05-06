// routes/sponsorRoutes.js
const express = require("express");
const router = express.Router();
const sponsorController = require("../controllers/sponsorController");

router.post("/", sponsorController.createSponsorController);
router.get("/club/:clubId", sponsorController.getAllSponsorsController);
router.get("/club/:clubId", sponsorController.getAllLeadsController);
router.get("/:id", sponsorController.getSponsorController);
router.put("/:id", sponsorController.updateSponsorController);
router.delete("/:id", sponsorController.deleteSponsorController);

module.exports = router;
