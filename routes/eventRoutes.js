const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Create Event
router.post("/", eventController.createEvent);

// Update Event
router.put("/:id", eventController.updateEvent);

// Delete Event
router.delete("/:id", eventController.deleteEvent);

// Get Single Event
router.get("/:id", eventController.getEventById);

// Get All Events by Club ID
router.get("/club/:clubId", eventController.getAllEventsByClubId);

module.exports = router;
