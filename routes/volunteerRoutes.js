import express from "express";

const volunteerController = require("../controllers/volunteerController");

const router = express.Router();

router.post("/", volunteerController.createVolunteer);
router.get("/", volunteerController.getAllVolunteers);
router.get("/:id", volunteerController.getVolunteerById);
router.delete("/:id", volunteerController.deleteVolunteer);

export default router;
