const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saves
savedJobSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

// Quickly fetch candidate's saved jobs
savedJobSchema.index({
  candidate: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "SavedJob",
  savedJobSchema
);