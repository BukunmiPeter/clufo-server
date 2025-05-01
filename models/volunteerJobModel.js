const mongoose = require("mongoose");

const volunteerJobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    reportName: { type: String },
    status: { type: String, enum: ["active", "finished"], default: "active" },
    dateCreated: { type: Date, default: Date.now },
    eventDate: { type: Date },
    startDate: { type: Date },
    startTime: { type: String },
    endDate: { type: Date },
    endTime: { type: String },
    event: { type: String },
    location: { type: String },
    locationType: { type: String },
    description: { type: String },
    requiredSkills: { type: [String], default: [] },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],
    requiredNumberVolunteers: { type: Number },
    visibility: {
      type: String,
      enum: ["public", "members only"],
      default: "public",
    },
    requiredApprovalForSignups: { type: Boolean, default: false },
    obligationTracking: { type: Boolean, default: false },
    recurringJob: {
      type: String,
      enum: ["daily", "weekly", "monthly", "none"],
      default: "none",
    },
    recurringUntil: { type: Date },
  },
  { timestamps: true }
);

const VolunteerJob = mongoose.model("VolunteerJob", volunteerJobSchema);
module.exports = VolunteerJob;
