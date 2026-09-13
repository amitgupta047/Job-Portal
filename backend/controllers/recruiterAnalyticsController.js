const Job = require("../models/job");
const Application = require("../models/Application");

// =====================================================
// GET OVERALL RECRUITER ANALYTICS
// GET /api/recruiter/analytics
// =====================================================

const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // -------------------------------------------------
    // 1. GET ALL JOBS OF LOGGED-IN RECRUITER
    // -------------------------------------------------

    const jobs = await Job.find({
      recruiter: recruiterId,
    })
      .select("_id title company location status createdAt")
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((job) => job._id);

    const totalJobs = jobs.length;

    // -------------------------------------------------
    // 2. IF RECRUITER HAS NO JOBS
    // -------------------------------------------------

    if (jobIds.length === 0) {
      return res.status(200).json({
        success: true,

        analytics: {
          totalJobs: 0,
          totalApplications: 0,

          applied: 0,
          shortlisted: 0,
          interview: 0,
          selected: 0,
          rejected: 0,

          selectionRate: 0,
          rejectionRate: 0,

          jobWise: [],
        },
      });
    }

    // -------------------------------------------------
    // 3. OVERALL APPLICATION STATUS
    // -------------------------------------------------

    const applicationStats = await Application.aggregate([
      {
        $match: {
          job: {
            $in: jobIds,
          },
        },
      },

      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // -------------------------------------------------
    // 4. DEFAULT STATUS COUNTS
    // -------------------------------------------------

    const statusCounts = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };

    applicationStats.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // -------------------------------------------------
    // 5. TOTAL APPLICATIONS
    // -------------------------------------------------

    const totalApplications = Object.values(
      statusCounts
    ).reduce((total, count) => total + count, 0);

    // -------------------------------------------------
    // 6. OVERALL RATES
    // -------------------------------------------------

    const selectionRate =
      totalApplications > 0
        ? Number(
            (
              (statusCounts.Selected / totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;

    const rejectionRate =
      totalApplications > 0
        ? Number(
            (
              (statusCounts.Rejected / totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;

    // =================================================
    // 7. JOB-WISE APPLICATION ANALYTICS
    // =================================================

    const jobWiseStats = await Application.aggregate([
      {
        $match: {
          job: {
            $in: jobIds,
          },
        },
      },

      {
        $group: {
          _id: {
            job: "$job",
            status: "$status",
          },

          count: {
            $sum: 1,
          },
        },
      },

      {
        $group: {
          _id: "$_id.job",

          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },

          totalApplications: {
            $sum: "$count",
          },
        },
      },
    ]);

    // -------------------------------------------------
    // 8. CREATE EASY-TO-USE JOB ANALYTICS OBJECT
    // -------------------------------------------------

    const jobWise = jobs.map((job) => {
      const stats = jobWiseStats.find(
        (item) =>
          item._id.toString() === job._id.toString()
      );

      const counts = {
        Applied: 0,
        Shortlisted: 0,
        Interview: 0,
        Selected: 0,
        Rejected: 0,
      };

      if (stats) {
        stats.statuses.forEach((item) => {
          if (counts[item.status] !== undefined) {
            counts[item.status] = item.count;
          }
        });
      }

      const totalJobApplications =
        Object.values(counts).reduce(
          (total, count) => total + count,
          0
        );

      // ------------------------------------------------
      // JOB SELECTION RATE
      // ------------------------------------------------

      const jobSelectionRate =
        totalJobApplications > 0
          ? Number(
              (
                (counts.Selected / totalJobApplications) *
                100
              ).toFixed(2)
            )
          : 0;

      return {
        _id: job._id,

        title: job.title,

        company: job.company,

        location: job.location,

        status: job.status || "Active",

        createdAt: job.createdAt,

        totalApplications: totalJobApplications,

        applied: counts.Applied,

        shortlisted: counts.Shortlisted,

        interview: counts.Interview,

        selected: counts.Selected,

        rejected: counts.Rejected,

        selectionRate: jobSelectionRate,
      };
    });

    // -------------------------------------------------
    // 9. SORT JOBS BY APPLICATIONS
    // -------------------------------------------------

    jobWise.sort(
      (a, b) =>
        b.totalApplications - a.totalApplications
    );

    // -------------------------------------------------
    // 10. FINAL RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      analytics: {
        // Overall
        totalJobs,

        totalApplications,

        applied: statusCounts.Applied,

        shortlisted: statusCounts.Shortlisted,

        interview: statusCounts.Interview,

        selected: statusCounts.Selected,

        rejected: statusCounts.Rejected,

        // Rates
        selectionRate,

        rejectionRate,

        // Job-wise
        jobWise,
      },
    });
  } catch (error) {
    console.error(
      "RECRUITER ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch recruiter analytics",

      error: error.message,
    });
  }
};

// =====================================================
// GET JOB-WISE ANALYTICS
// GET /api/recruiter/job-analytics/:jobId
// =====================================================

const getJobWiseAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const { jobId } = req.params;

    // -------------------------------------------------
    // 1. FIND JOB
    // -------------------------------------------------

    const job = await Job.findById(jobId).select(
      "_id title company location salary jobType experience status recruiter createdAt"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // -------------------------------------------------
    // 2. OWNERSHIP CHECK
    // -------------------------------------------------

    if (
      job.recruiter.toString() !==
      recruiterId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view analytics for this job",
      });
    }

    // -------------------------------------------------
    // 3. APPLICATION STATUS ANALYTICS
    // -------------------------------------------------

    const applicationStats =
      await Application.aggregate([
        {
          $match: {
            job: job._id,
          },
        },

        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    // -------------------------------------------------
    // 4. DEFAULT STATUS COUNTS
    // -------------------------------------------------

    const statusCounts = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };

    applicationStats.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // -------------------------------------------------
    // 5. TOTAL APPLICATIONS
    // -------------------------------------------------

    const totalApplications = Object.values(
      statusCounts
    ).reduce(
      (total, count) => total + count,
      0
    );

    // -------------------------------------------------
    // 6. SELECTION RATE
    // -------------------------------------------------

    const selectionRate =
      totalApplications > 0
        ? Number(
            (
              (statusCounts.Selected /
                totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;

    // -------------------------------------------------
    // 7. REJECTION RATE
    // -------------------------------------------------

    const rejectionRate =
      totalApplications > 0
        ? Number(
            (
              (statusCounts.Rejected /
                totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;

    // -------------------------------------------------
    // 8. RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      job: {
        _id: job._id,

        title: job.title,

        company: job.company,

        location: job.location,

        salary: job.salary,

        jobType: job.jobType,

        experience: job.experience,

        status: job.status || "Active",

        createdAt: job.createdAt,
      },

      analytics: {
        totalApplications,

        applied: statusCounts.Applied,

        shortlisted: statusCounts.Shortlisted,

        interview: statusCounts.Interview,

        selected: statusCounts.Selected,

        rejected: statusCounts.Rejected,

        selectionRate,

        rejectionRate,
      },
    });
  } catch (error) {
    console.error(
      "JOB-WISE ANALYTICS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch job-wise analytics",

      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getRecruiterAnalytics,
  getJobWiseAnalytics,
};
