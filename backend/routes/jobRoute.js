const express = require("express");

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    updateJobStatus,
    deleteJob
} = require("../controllers/jobController.js");

const {
    protect,
    recruiterOnly
} = require("../middlewares/authMiddleware.js");


const router = express.Router();


// Public routes

router.get(
    "/",
    getAllJobs
);

router.get(
    "/:id",
    getJobById
);


// Recruiter routes

router.post(
    "/",
    protect,
    recruiterOnly,
    createJob
);

router.put(
    "/:id",
    protect,
    recruiterOnly,
    updateJob
);

// ========================================
// UPDATE JOB STATUS
// Active <-> Closed
// ========================================

router.patch(
  "/:id/status",
  protect,
  recruiterOnly,
  updateJobStatus
);

router.delete(
    "/:id",
    protect,
    recruiterOnly,
    deleteJob
);

module.exports = router;