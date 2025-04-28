const Event = require("../models/eventModel.js");

const createEvent = (eventData) => {
  return Event.create(eventData);
};

const updateEvent = (id, updateData) => {
  return Event.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteEvent = (id) => {
  return Event.findByIdAndDelete(id);
};

const getEventById = (id) => {
  return Event.findById(id).populate("club").populate("team");
};
const getAllEventsByClubId = async (clubId, status = "all") => {
  const now = new Date();

  // Fetch all events first
  const events = await Event.find({ club: clubId })
    .populate("club")
    .populate("team")
    .sort({ eventDate: 1, eventTime: 1 }); // Upcoming first

  if (status === "all") {
    return events;
  }

  // Filter events based on eventDate + eventTime
  const filteredEvents = events.filter((event) => {
    const eventDateTime = new Date(event.eventDate);
    const [hours, minutes] = event.eventTime.split(":").map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    if (status === "upcoming") {
      return eventDateTime >= now;
    } else if (status === "past") {
      return eventDateTime < now;
    }
    return true; // default to include
  });

  return filteredEvents;
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEventsByClubId,
};
