const express = require("express");

const router = express.Router();


const {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    getRecruiterApplicants,
    getApplicationResume,
    getCandidateProfile,
    updateApplicationStatus
} = require("../controllers/applicationController");


const {
    protect,
    recruiterOnly
} = require("../middlewares/authMiddleware.js");


const upload =
    require("../middlewares/uploads.js");


// CANDIDATE ROUTES


// Apply for a job
router.post(
    "/apply/:jobId",
    protect,
    upload.single("resume"),
    applyForJob
);


router.get(
    "/my-applications",
    protect,
    getMyApplications
);

router.get( 
    "/:applicationId/candidate", 
    protect, 
    recruiterOnly, 
    getCandidateProfile 
);


// RECRUITER ROUTES

router.get( 
    "/recruiter-applicants", 
    protect, 
    recruiterOnly, 
    getRecruiterApplicants 
);

router.get( 
    "/:applicationId/resume", 
    protect, 
    recruiterOnly, 
    getApplicationResume 
);

router.get(
    "/job/:jobId",
    protect,
    recruiterOnly,
    getJobApplicants
);

router.put(
    "/:applicationId/status",
    protect,
    recruiterOnly,
    updateApplicationStatus
);


module.exports = router;