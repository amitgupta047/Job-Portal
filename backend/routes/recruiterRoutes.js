
const express = require("express");

const router = express.Router();

// ========================================
// CONTROLLER
// ========================================

const {
  getRecruiterAnalytics,
  getJobWiseAnalytics,
} = require("../controllers/recruiterAnalyticsController");

// ========================================
// MIDDLEWARE
// ========================================

const {
  protect,
  recruiterOnly,
} = require("../middlewares/authMiddleware");

// ========================================
// OVERALL RECRUITER ANALYTICS
// ========================================

router.get(
  "/analytics",
  protect,
  recruiterOnly,
  getRecruiterAnalytics
);

// ========================================
// JOB-WISE ANALYTICS
// ========================================

router.get(
  "/job-analytics/:jobId",
  protect,
  recruiterOnly,
  getJobWiseAnalytics
);

// ========================================
// EXPORT
// ========================================

module.exports = router;

