const mongoose = require("mongoose");

const pipelineStageSchema = new mongoose.Schema({
  sponsors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sponsor",
    },
  ],
  amount: {
    type: Number,
    default: 0,
  },
});

const pipelineSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    pitched: pipelineStageSchema,
    negotiation: pipelineStageSchema,
    agreed: pipelineStageSchema,
    signed: pipelineStageSchema,
    lost: pipelineStageSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pipeline", pipelineSchema);
