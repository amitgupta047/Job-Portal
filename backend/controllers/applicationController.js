
const mongoose = require("mongoose");

const Application = require("../models/Application");
const Notification = require("../models/notification");
const Job = require("../models/job");

// ========================================
// APPLY FOR JOB
// ========================================

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user._id;

        // Check resume
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume is required"
            });
        }

        // Check job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check duplicate application
        const existingApplication =
            await Application.findOne({
                job: jobId,
                candidate: candidateId
            });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Resume path
        const resumePath =
            `/uploads/resumes/${req.file.filename}`;

        // Create application
        const application =
            await Application.create({
                job: jobId,
                candidate: candidateId,
                resume: resumePath,
                status: "Applied"
            });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error(
            "APPLY JOB ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ========================================
// CANDIDATE - MY APPLICATIONS
// ========================================

const getMyApplications = async (req, res) => {
    try {
        const applications =
            await Application.find({
                candidate: req.user._id
            })
            .populate(
                "job",
                "title company location salary jobType experience"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "MY APPLICATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET CANDIDATE PROFILE
// Recruiter only
// ========================================

const getCandidateProfile = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find application
        const application = await Application.findById(applicationId)
            .populate(
                "candidate",
                "name email phone location bio skills education experience linkedin github resume profilePicture"
            )
            .populate(
                "job",
                "title company location salary jobType experience recruiter"
            );

        // Application not found
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Make sure recruiter owns this job
        if (
            !application.job ||
            application.job.recruiter.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this candidate.",
            });
        }

        // Candidate not found
        if (!application.candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found.",
            });
        }

        return res.status(200).json({
            success: true,

            candidate: application.candidate,

            application: {
                _id: application._id,
                status: application.status,
                resume: application.resume,
                createdAt: application.createdAt,
                updatedAt: application.updatedAt,
            },

            job: application.job,
        });
    } catch (error) {
        console.error("GET CANDIDATE PROFILE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch candidate profile.",
            error: error.message,
        });
    }
};


// ========================================
// RECRUITER - VIEW APPLICANTS FOR ONE JOB
// ========================================

const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Only job owner can see applicants
        if (
            job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only view applicants for your own job"
            });
        }

        const applications =
            await Application.find({
                job: jobId
            })
            .populate(
                "candidate",
                "name email"
            )
            .populate(
                "job",
                "title company"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "GET APPLICANTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ========================================
// RECRUITER - SEARCH + FILTER APPLICANTS
// ========================================

const getRecruiterApplicants = async (req, res) => {
    try {
        const recruiterId = req.user._id;

        const {
            search = "",
            status = "",
            jobId = "",
            page = 1,
            limit = 10
        } = req.query;

        // ========================================
        // PAGINATION
        // ========================================

        const currentPage = Math.max(
            Number.parseInt(page, 10) || 1,
            1
        );

        const applicantsPerPage = Math.min(
            Math.max(
                Number.parseInt(limit, 10) || 10,
                1
            ),
            50
        );

        const skip =
            (currentPage - 1) *
            applicantsPerPage;

        // ========================================
        // GET RECRUITER JOBS
        // ========================================

        const recruiterJobs =
            await Job.find({
                recruiter: recruiterId
            }).select("_id");

        const recruiterJobIds =
            recruiterJobs.map(
                (job) => job._id
            );

        // ========================================
        // NO JOBS
        // ========================================

        if (recruiterJobIds.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                totalApplicants: 0,
                totalPages: 0,
                currentPage,
                limit: applicantsPerPage,
                applicants: []
            });
        }

        // ========================================
        // BASE QUERY
        // ========================================

        const query = {
            job: {
                $in: recruiterJobIds
            }
        };

        // ========================================
        // JOB FILTER
        // ========================================

        if (jobId) {
            if (
                !mongoose.Types.ObjectId.isValid(
                    jobId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid job ID"
                });
            }

            const isRecruiterJob =
                recruiterJobIds.some(
                    (id) =>
                        id.toString() === jobId
                );

            if (!isRecruiterJob) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to access this job"
                });
            }

            query.job = jobId;
        }

        // ========================================
        // STATUS FILTER
        // ========================================

        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        ];

        if (status) {
            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid application status"
                });
            }

            query.status = status;
        }

        // ========================================
        // FETCH APPLICATIONS
        // ========================================

        let applications =
            await Application.find(query)
                .populate(
                    "candidate",
                    "name email phone location skills education experience linkedin github resume profilePicture"
                )
                .populate(
                    "job",
                    "title company location salary jobType experience"
                )
                .sort({
                    createdAt: -1
                })
                .lean();

        // ========================================
        // SEARCH
        // ========================================

        if (search.trim()) {
            const searchText =
                search
                    .trim()
                    .toLowerCase();

            applications =
                applications.filter(
                    (application) => {
                        const candidate =
                            application.candidate;

                        const job =
                            application.job;

                        const candidateName =
                            candidate?.name
                                ?.toLowerCase() ||
                            "";

                        const candidateEmail =
                            candidate?.email
                                ?.toLowerCase() ||
                            "";

                        const jobTitle =
                            job?.title
                                ?.toLowerCase() ||
                            "";

                        return (
                            candidateName.includes(
                                searchText
                            ) ||
                            candidateEmail.includes(
                                searchText
                            ) ||
                            jobTitle.includes(
                                searchText
                            )
                        );
                    }
                );
        }

        // ========================================
        // TOTAL
        // ========================================

        const totalApplicants =
            applications.length;

        const totalPages =
            totalApplicants > 0
                ? Math.ceil(
                    totalApplicants /
                    applicantsPerPage
                )
                : 0;

        // ========================================
        // PAGINATION
        // ========================================

        const paginatedApplicants =
            applications.slice(
                skip,
                skip + applicantsPerPage
            );

        // ========================================
        // RESPONSE
        // ========================================

        return res.status(200).json({
            success: true,

            count:
                paginatedApplicants.length,

            totalApplicants,

            totalPages,

            currentPage,

            limit:
                applicantsPerPage,

            applicants:
                paginatedApplicants
        });

    } catch (error) {
        console.error(
            "GET RECRUITER APPLICANTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch recruiter applicants"
        });
    }
};

// ========================================
// RECRUITER - UPDATE APPLICATION STATUS
// ========================================

const updateApplicationStatus = async (
    req,
    res
) => {
    try {
        const { applicationId } =
            req.params;

        const { status } =
            req.body;

        // Allowed statuses
        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid application status"
            });
        }

        // Find application
        const application =
            await Application.findById(
                applicationId
            );

        if (!application) {
            return res.status(404).json({
                success: false,
                message:
                    "Application not found"
            });
        }

        // Find associated job
        const job =
            await Job.findById(
                application.job
            );

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found"
            });
        }

        // Only job owner can update
        if (
            job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update applications for your own jobs"
            });
        }

        // Store old status
        const oldStatus =
            application.status;

        // Update status
        application.status = status;

        await application.save();

        // ========================================
        // NOTIFICATION DATA
        // ========================================

        const notificationData = {
            Shortlisted: {
                message:
                    "🎉 Your application has been shortlisted.",
                type: "shortlisted"
            },

            Interview: {
                message:
                    "📅 Your application has moved to the interview stage.",
                type: "interview"
            },

            Selected: {
                message:
                    "🎉 Congratulations! You have been selected.",
                type: "selected"
            },

            Rejected: {
                message:
                    "Your application has been rejected.",
                type: "rejected"
            }
        };

        // ========================================
        // CREATE NOTIFICATION
        // ========================================

        if (
            oldStatus !== status &&
            notificationData[status]
        ) {
            await Notification.create({
                recipient:
                    application.candidate,

                message:
                    notificationData[status]
                        .message,

                type:
                    notificationData[status]
                        .type,

                job:
                    application.job,

                application:
                    application._id
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getApplicationResume = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find application and populate job
        const application = await Application.findById(applicationId)
            .populate(
                "job",
                "title company recruiter"
            );

        // Application not found
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        // Check job exists
        if (!application.job) {
            return res.status(404).json({
                success: false,
                message: "Job associated with this application was not found.",
            });
        }

        // Check recruiter ownership
        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to access this resume.",
            });
        }

        // Check resume exists
        if (!application.resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not available.",
            });
        }

        return res.status(200).json({
            success: true,

            resume: {
                url: application.resume,
                fileName: application.resume
                    .split("/")
                    .pop(),
            },

            application: {
                _id: application._id,
                status: application.status,
            },

            job: {
                title: application.job.title,
                company: application.job.company,
            },
        });
    } catch (error) {
        console.error(
            "GET APPLICATION RESUME ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to access resume.",
            error: error.message,
        });
    }
};


// ========================================
// EXPORTS
// ========================================

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    getRecruiterApplicants,
    getApplicationResume,
    getCandidateProfile,
    updateApplicationStatus
};
