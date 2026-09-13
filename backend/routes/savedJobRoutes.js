const express = require("express");

const router = express.Router();

const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSaved,
} = require(
  "../controllers/savedJobController"
);

const {
  protect,
  candidateOnly,
} = require(
  "../middlewares/authMiddleware"
);

// Save Job
router.post(
  "/:jobId",
  protect,
  candidateOnly,
  saveJob
);

// Remove
router.delete(
  "/:jobId",
  protect,
  candidateOnly,
  removeSavedJob
);

// My Saved Jobs
router.get(
  "/",
  protect,
  candidateOnly,
  getSavedJobs
);

// Check Saved
router.get(
  "/check/:jobId",
  protect,
  candidateOnly,
  checkSaved
);

module.exports = router;