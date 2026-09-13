const mongoose = require("mongoose");

const SavedJob = require("../models/SavedJob");
const Job = require("../models/job");

// ========================================
// SAVE JOB
// POST /api/saved-jobs/save/:jobId
// ========================================
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check already saved
    const alreadySaved = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
        isSaved: true,
      });
    }

    // Save job
    const saved = await SavedJob.create({
      candidate: req.user._id,
      job: jobId,
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      isSaved: true,
      saved,
    });
  } catch (error) {
    console.error("SAVE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET SAVED JOBS
// GET /api/saved-jobs
// ========================================
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      candidate: req.user._id,
    })
      .populate({
        path: "job",
        populate: {
          path: "recruiter",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    console.error("GET SAVED JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// REMOVE SAVED JOB
// DELETE /api/saved-jobs/save/:jobId
// ========================================
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const removedJob = await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: jobId,
    });

    if (!removedJob) {
      return res.status(404).json({
        success: false,
        message: "Job is not in saved jobs",
        isSaved: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from saved jobs",
      isSaved: false,
    });
  } catch (error) {
    console.error("REMOVE SAVED JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// CHECK SAVED JOB
// GET /api/saved-jobs/check/:jobId
// ========================================
const checkSaved = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const saved = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId,
    }).lean();

    return res.status(200).json({
      success: true,
      isSaved: Boolean(saved),
    });
  } catch (error) {
    console.error("CHECK SAVED JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// EXPORT
// ========================================
module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSaved,
};