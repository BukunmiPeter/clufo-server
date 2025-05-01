import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    skills: { type: [String], default: [] },
    profilePic: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Volunteer", volunteerSchema);
