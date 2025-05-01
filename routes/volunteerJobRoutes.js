const express = require("express");

const volunteerJobController = require("../controllers/volunteerJobController");

const router = express.Router();

router.post("/", volunteerJobController.createVolunteerJob);
router.get("/", volunteerJobController.getAllVolunteerJobs);
router.put("/:id", volunteerJobController.updateVolunteerJob);
router.delete("/:id", volunteerJobController.deleteVolunteerJob);

module.exports = router;
