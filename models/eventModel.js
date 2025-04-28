const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: function () {
        return this.eventType === "HomeMatch" || this.eventType === "AwayMatch";
      },
    },
    eventType: {
      type: String,
      enum: ["HomeMatch", "AwayMatch", "Meeting"],
      required: true,
    },
    eventName: { type: String, required: true },
    eventDescription: { type: String },
    eventLocation: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    meetingImage: { type: String },
    teamJerseyImage: { type: String },
    opponentJerseyImage: { type: String },
    opponentClubName: {
      type: String,
      required: function () {
        return this.eventType === "HomeMatch" || this.eventType === "AwayMatch";
      },
    },
    opponentTeamName: {
      type: String,
      required: function () {
        return this.eventType === "HomeMatch" || this.eventType === "AwayMatch";
      },
    },
    // status: {
    //   type: String,
    //   enum: ["Upcoming", "Past"],
    //   default: "Upcoming", // when created, assume it hasn't happened yet
    // },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
