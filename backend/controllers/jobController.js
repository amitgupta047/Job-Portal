const Job = require("../models/job.js");

// ========================================
// ESCAPE SPECIAL REGEX CHARACTERS
// ========================================

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ========================================
// CREATE JOB
// ========================================

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      discription,
      location,
      salary,
      skills,
      jobType,
      experience,
    } = req.body;

    // -------------------------------
    // Validation
    // -------------------------------

    if (
      !title ||
      !company ||
      !discription ||
      !location ||
      salary === undefined ||
      !skills ||
      !jobType ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // -------------------------------
    // Create Job
    // -------------------------------

    const job = await Job.create({
      title,
      company,
      discription,
      location,
      salary,
      skills,
      jobType,
      experience,

      // New jobs are Active by default
      status: "Active",

      recruiter: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL JOBS
// ========================================

const getAllJobs = async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      jobType = "",
      experience = "",
      skills = "",
      minSalary = "",
      maxSalary = "",
      page = "1",
      limit = "6",
    } = req.query;

    // ========================================
    // PAGINATION
    // ========================================

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const jobsPerPage = Math.min(
      Math.max(parseInt(limit, 10) || 6, 1),
      50
    );

    const skip = (currentPage - 1) * jobsPerPage;

    // ========================================
    // BUILD MONGODB QUERY
    // ========================================

    const query = {};

    // ========================================
    // SEARCH
    // title OR company OR description
    // ========================================

    const cleanSearch = search.trim();

    if (cleanSearch) {
      const safeSearch = escapeRegex(cleanSearch);

      query.$or = [
        {
          title: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          company: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          discription: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // ========================================
    // LOCATION
    // ========================================

    const cleanLocation = location.trim();

    if (cleanLocation) {
      query.location = {
        $regex: escapeRegex(cleanLocation),
        $options: "i",
      };
    }

    // ========================================
    // JOB TYPE
    // ========================================

    const cleanJobType = jobType.trim();

    if (cleanJobType) {
      query.jobType = {
        $regex: `^${escapeRegex(cleanJobType)}$`,
        $options: "i",
      };
    }

    // ========================================
    // EXPERIENCE
    // ========================================

    const cleanExperience = experience.trim();

    if (cleanExperience) {
      query.experience = {
        $regex: escapeRegex(cleanExperience),
        $options: "i",
      };
    }

    // ========================================
    // SKILLS
    // ========================================

    const cleanSkills = skills.trim();

    if (cleanSkills) {
      query.skills = {
        $regex: escapeRegex(cleanSkills),
        $options: "i",
      };
    }

    // ========================================
    // SALARY
    // ========================================

    const parsedMinSalary =
      minSalary !== "" ? Number(minSalary) : null;

    const parsedMaxSalary =
      maxSalary !== "" ? Number(maxSalary) : null;

    // -------------------------------
    // Validate salary values
    // -------------------------------

    if (
      (parsedMinSalary !== null &&
        (!Number.isFinite(parsedMinSalary) ||
          parsedMinSalary < 0)) ||
      (parsedMaxSalary !== null &&
        (!Number.isFinite(parsedMaxSalary) ||
          parsedMaxSalary < 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid salary range",
      });
    }

    // -------------------------------
    // Validate min <= max
    // -------------------------------

    if (
      parsedMinSalary !== null &&
      parsedMaxSalary !== null &&
      parsedMinSalary > parsedMaxSalary
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum salary cannot be greater than maximum salary",
      });
    }

    // -------------------------------
    // Apply salary filters
    // -------------------------------

    if (
      parsedMinSalary !== null ||
      parsedMaxSalary !== null
    ) {
      query.salary = {};

      if (parsedMinSalary !== null) {
        query.salary.$gte = parsedMinSalary;
      }

      if (parsedMaxSalary !== null) {
        query.salary.$lte = parsedMaxSalary;
      }
    }

    // ========================================
    // FETCH JOBS + COUNT IN PARALLEL
    // ========================================

    const [totalJobs, jobs] = await Promise.all([
      Job.countDocuments(query),

      Job.find(query)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(jobsPerPage)
        .lean(),
    ]);

    // ========================================
    // TOTAL PAGES
    // ========================================

    const totalPages = Math.ceil(
      totalJobs / jobsPerPage
    );

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage,
      limit: jobsPerPage,
      jobs,
    });
  } catch (error) {
    console.error("GET ALL JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// ========================================
// GET SINGLE JOB
// ========================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE JOB
// ========================================

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ========================================
    // CHECK RECRUITER OWNERSHIP
    // ========================================

    if (
      job.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this job",
      });
    }

    // ========================================
    // GET UPDATED FIELDS
    // ========================================

    const {
      title,
      company,
      discription,
      location,
      salary,
      skills,
      jobType,
      experience,
    } = req.body;

    // ========================================
    // UPDATE FIELDS
    // ========================================

    job.title =
      title ?? job.title;

    job.company =
      company ?? job.company;

    job.discription =
      discription ?? job.discription;

    job.location =
      location ?? job.location;

    job.salary =
      salary ?? job.salary;

    job.skills =
      skills ?? job.skills;

    job.jobType =
      jobType ?? job.jobType;

    job.experience =
      experience ?? job.experience;

    // IMPORTANT:
    // Status is NOT changed here.
    // Use updateJobStatus API for Active/Closed.

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// ========================================
// DELETE JOB
// ========================================

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ========================================
    // CHECK RECRUITER OWNERSHIP
    // ========================================

    if (
      job.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this job",
      });
    }

    // ========================================
    // DELETE JOB
    // ========================================

    await Job.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// ========================================
// CLOSE / REOPEN JOB
// ========================================

const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ========================================
    // VALIDATE STATUS
    // ========================================

    if (
      !["Active", "Closed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be Active or Closed.",
      });
    }

    // ========================================
    // FIND JOB
    // ========================================

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ========================================
    // CHECK RECRUITER OWNERSHIP
    // ========================================

    if (
      job.recruiter.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this job.",
      });
    }

    // ========================================
    // UPDATE STATUS
    // ========================================

    job.status = status;

    await job.save();

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        status === "Closed"
          ? "Job closed successfully."
          : "Job reopened successfully.",

      job,
    });
  } catch (error) {
    console.error(
      "UPDATE JOB STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update job status.",
      error: error.message,
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};


