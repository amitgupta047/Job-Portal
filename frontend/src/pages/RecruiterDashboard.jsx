import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [deletingJob, setDeletingJob] = useState(null);
  const [updatingApplication, setUpdatingApplication] = useState(null);
  const [updatingJobStatus, setUpdatingJobStatus] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================================
  // Fetch Recruiter's Jobs
  // ================================
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      setError("");

      const response = await api.get("/jobs");

      const allJobs = response.data.jobs || [];

      const recruiterId = user?.id || user?._id;

      const recruiterJobs = allJobs.filter((job) => {
        const jobRecruiterId =
          job.recruiter?._id ||
          job.recruiter?.id ||
          job.recruiter;

        return String(jobRecruiterId) === String(recruiterId);
      });

      setJobs(recruiterJobs);

      // If selected job no longer exists
      if (selectedJob) {
        const updatedSelectedJob = recruiterJobs.find(
          (job) => job._id === selectedJob._id
        );

        if (!updatedSelectedJob) {
          setSelectedJob(null);
          setApplications([]);
        } else {
          setSelectedJob(updatedSelectedJob);
        }
      }
    } catch (error) {
      console.error("FETCH RECRUITER JOBS ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load your jobs. Please try again."
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  // ================================
  // Fetch Applicants
  // ================================
  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      setError("");

      const response = await api.get(`/applications/job/${jobId}`);

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("FETCH APPLICANTS ERROR:", error);

      setApplications([]);

      setError(
        error.response?.data?.message ||
        "Failed to load applicants."
      );
    } finally {
      setLoadingApplicants(false);
    }
  };

  // ================================
  // Select Job
  // ================================
  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setApplications([]);
    setSuccess("");
    fetchApplicants(job._id);
  };

  // ================================
  // Refresh Applicants
  // ================================
  const handleRefreshApplicants = () => {
    if (!selectedJob) return;

    fetchApplicants(selectedJob._id);
  };

  // ================================
  // Delete Job
  // ================================
  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingJob(jobId);
      setError("");
      setSuccess("");

      await api.delete(`/jobs/${jobId}`);

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobId)
      );

      // If deleted job was selected
      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }

      setSuccess("Job deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to delete job. Please try again."
      );
    } finally {
      setDeletingJob(null);
    }
  };

  // ================================
  // CLOSE / REOPEN JOB
  // ================================
  const handleJobStatus = async (jobId, currentStatus) => {
    const newStatus =
      currentStatus === "Closed"
        ? "Active"
        : "Closed";

    const confirmMessage =
      newStatus === "Closed"
        ? "Are you sure you want to close this job?\n\nCandidates will not be able to apply once applications are closed."
        : "Are you sure you want to reopen this job?";

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    try {
      setUpdatingJobStatus(jobId);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/jobs/${jobId}/status`,
        {
          status: newStatus,
        }
      );

      const updatedJob = response.data.job;

      // Update job in jobs list
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? {
              ...job,
              status:
                updatedJob?.status || newStatus,
            }
            : job
        )
      );

      // Update selected job if same job
      if (selectedJob?._id === jobId) {
        setSelectedJob((prevJob) =>
          prevJob
            ? {
              ...prevJob,
              status:
                updatedJob?.status || newStatus,
            }
            : prevJob
        );
      }

      setSuccess(
        newStatus === "Closed"
          ? "Job closed successfully."
          : "Job reopened successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("UPDATE JOB STATUS ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to update job status. Please try again."
      );
    } finally {
      setUpdatingJobStatus(null);
    }
  };

  // ================================
  // Update Application Status
  // ================================
  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingApplication(applicationId);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        { status }
      );

      const updatedStatus =
        response.data.application?.status || status;

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? {
              ...application,
              status: updatedStatus,
            }
            : application
        )
      );

      setSuccess(
        `Application status updated to "${updatedStatus}".`
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to update application status."
      );
    } finally {
      setUpdatingApplication(null);
    }
  };

  // ================================
  // Status Count
  // ================================
  const getStatusCount = (status) => {
    return applications.filter(
      (application) => application.status === status
    ).length;
  };

  // ================================
  // Format Date
  // ================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================================
  // Application Status Class
  // ================================
  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-applied";
    }
  };

  // ================================
  // Initial Fetch
  // ================================
  useEffect(() => {
    const userId = user?.id || user?._id;

    if (userId) {
      fetchJobs();
    } else {
      setLoadingJobs(false);
    }
  }, [user]);

  return (
    <div className="recruiter-dashboard">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="navbar">

        <div className="navbar-left">
          <Link
            to="/recruiter-dashboard"
            className="logo"
          >
            JobPortal
          </Link>
        </div>

        <div className="navbar-right">

          <span className="welcome-text">
            Hi, {user?.name || "Recruiter"} 👋
          </span>

          <Link
            to="/create-job"
            className="create-job-nav-btn"
          >
            + Create Job
          </Link>

          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <h1>Recruiter Dashboard</h1>

            <p>
              Manage your jobs and applications from one place.
            </p>
          </div>

          <Link
            to="/create-job"
            className="create-job-main-btn"
          >
            + Post New Job
          </Link>

        </div>

        {/* SUCCESS MESSAGE */}

        {success && (
          <div className="success-message">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            <span>⚠</span>
            {error}

            <button
              onClick={() => setError("")}
              className="close-error"
            >
              ×
            </button>
          </div>
        )}

        {/* ======================================
            JOBS SECTION
        ====================================== */}

        <section className="jobs-section">

          <div className="section-header">

            <div>
              <h2>My Jobs</h2>

              <p>
                {jobs.length}{" "}
                {jobs.length === 1
                  ? "job"
                  : "jobs"}{" "}
                posted
              </p>
            </div>

            <button
              onClick={fetchJobs}
              className="refresh-btn"
              disabled={loadingJobs}
            >
              🔄 Refresh
            </button>

          </div>

          {/* LOADING */}

          {loadingJobs && (
            <div className="loading-container">

              <div className="spinner"></div>

              <p>
                Loading your jobs...
              </p>

            </div>
          )}

          {/* NO JOBS */}

          {!loadingJobs &&
            jobs.length === 0 && (
              <div className="empty-state">

                <div className="empty-icon">
                  💼
                </div>

                <h3>
                  No Jobs Posted Yet
                </h3>

                <p>
                  Start attracting talented candidates by
                  posting your first job.
                </p>

                <Link
                  to="/create-job"
                  className="create-job-main-btn"
                >
                  + Create Your First Job
                </Link>

              </div>
            )}

          {/* JOB CARDS */}

          {!loadingJobs &&
            jobs.length > 0 && (
              <div className="jobs-grid">

                {jobs.map((job) => {

                  const jobStatus =
                    job.status || "Active";

                  return (
                    <div
                      className={`job-card ${selectedJob?._id === job._id
                          ? "selected-job-card"
                          : ""
                        } ${jobStatus === "Closed"
                          ? "closed-job-card"
                          : ""
                        }`}
                      key={job._id}
                    >

                      {/* JOB HEADER */}

                      <div className="job-card-header">

                        <div>
                          <h3>
                            {job.title}
                          </h3>

                          <p className="company-name">
                            🏢 {job.company}
                          </p>
                        </div>

                        <div className="job-badges">

                          <span className="job-type-badge">
                            {job.jobType}
                          </span>

                          <span
                            className={`job-status-badge ${jobStatus === "Closed"
                                ? "job-status-closed"
                                : "job-status-active"
                              }`}
                          >
                            {jobStatus === "Closed"
                              ? "● Closed"
                              : "● Active"}
                          </span>

                        </div>

                      </div>

                      {/* CLOSED NOTICE */}

                      {jobStatus === "Closed" && (
                        <div className="closed-notice">
                          🔒 Applications are closed
                        </div>
                      )}

                      {/* JOB INFO */}

                      <div className="job-info">

                        <div className="info-item">
                          <span>📍</span>

                          <span>
                            {job.location ||
                              "Location not specified"}
                          </span>
                        </div>

                        <div className="info-item">
                          <span>💰</span>

                          <span>
                            {job.salary
                              ? `₹${Number(
                                job.salary
                              ).toLocaleString(
                                "en-IN"
                              )}`
                              : "Salary not specified"}
                          </span>
                        </div>

                        <div className="info-item">
                          <span>💼</span>

                          <span>
                            {job.experience ||
                              "Experience not specified"}
                          </span>
                        </div>

                      </div>

                      {/* SKILLS */}

                      {job.skills?.length > 0 && (
                        <div className="skills-container">

                          {job.skills
                            .slice(0, 5)
                            .map(
                              (
                                skill,
                                index
                              ) => (
                                <span
                                  className="skill-tag"
                                  key={index}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          {job.skills.length > 5 && (
                            <span className="skill-more">
                              +
                              {job.skills.length -
                                5}
                            </span>
                          )}

                        </div>
                      )}

                      {/* POSTED DATE */}

                      <p className="posted-date">
                        Posted on{" "}
                        {formatDate(
                          job.createdAt
                        )}
                      </p>

                      {/* ACTIONS */}

                      <div className="job-actions">

                        <button
                          onClick={() =>
                            handleSelectJob(job)
                          }
                          className={`applicants-btn ${selectedJob?._id ===
                              job._id
                              ? "active"
                              : ""
                            }`}
                        >
                          👥 Applicants
                        </button>

                        <Link
                          to={`/edit-job/${job._id}`}
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleJobStatus(
                              job._id,
                              jobStatus
                            )
                          }
                          className={
                            jobStatus === "Closed"
                              ? "reopen-job-btn"
                              : "close-job-btn"
                          }
                          disabled={
                            updatingJobStatus ===
                            job._id
                          }
                        >
                          {updatingJobStatus ===
                            job._id
                            ? "Updating..."
                            : jobStatus === "Closed"
                              ? "↗ Reopen"
                              : "🔒 Close"}
                        </button>


                        <Link
                          to={`/job-analytics/${job._id}`}
                          className="analytics-btn"
                        >
                          📊 Analytics
                        </Link>



                        <Link
                          to="/recruiter-applicants"
                          className="all-applicants-btn"
                        >
                          👥 All Applicants
                        </Link>

                        <button
                          onClick={() =>
                            handleDeleteJob(
                              job._id
                            )
                          }
                          className="delete-btn"
                          disabled={
                            deletingJob ===
                            job._id
                          }
                        >
                          {deletingJob ===
                            job._id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </section>

        {/* ======================================
            APPLICANTS MANAGEMENT
        ====================================== */}

        {selectedJob && (
          <section className="applicants-section">

            {/* APPLICANTS HEADER */}

            <div className="applicants-header">

              <div>

                <p className="section-label">
                  APPLICANTS MANAGEMENT
                </p>

                <h2>
                  {selectedJob.title}
                </h2>

                <p>
                  {selectedJob.company} •{" "}
                  {selectedJob.location}
                </p>

              </div>

              <div className="applicant-header-actions">

                <button
                  onClick={
                    handleRefreshApplicants
                  }
                  className="refresh-btn"
                  disabled={
                    loadingApplicants
                  }
                >
                  🔄 Refresh
                </button>

                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setApplications([]);
                  }}
                  className="close-applicants-btn"
                >
                  ✕ Close
                </button>

              </div>

            </div>

            {/* STATUS SUMMARY */}

            {!loadingApplicants &&
              applications.length > 0 && (
                <div className="status-summary">

                  <div className="summary-card">
                    <span className="summary-number">
                      {applications.length}
                    </span>

                    <span className="summary-label">
                      Total
                    </span>
                  </div>

                  <div className="summary-card applied-summary">
                    <span className="summary-number">
                      {getStatusCount("Applied")}
                    </span>

                    <span className="summary-label">
                      Applied
                    </span>
                  </div>

                  <div className="summary-card shortlisted-summary">
                    <span className="summary-number">
                      {getStatusCount(
                        "Shortlisted"
                      )}
                    </span>

                    <span className="summary-label">
                      Shortlisted
                    </span>
                  </div>

                  <div className="summary-card interview-summary">
                    <span className="summary-number">
                      {getStatusCount(
                        "Interview"
                      )}
                    </span>

                    <span className="summary-label">
                      Interview
                    </span>
                  </div>

                  <div className="summary-card selected-summary">
                    <span className="summary-number">
                      {getStatusCount(
                        "Selected"
                      )}
                    </span>

                    <span className="summary-label">
                      Selected
                    </span>
                  </div>

                  <div className="summary-card rejected-summary">
                    <span className="summary-number">
                      {getStatusCount(
                        "Rejected"
                      )}
                    </span>

                    <span className="summary-label">
                      Rejected
                    </span>
                  </div>

                </div>
              )}

            {/* APPLICANTS LOADING */}

            {loadingApplicants && (
              <div className="loading-container">

                <div className="spinner"></div>

                <p>
                  Loading applicants...
                </p>

              </div>
            )}

            {/* NO APPLICANTS */}

            {!loadingApplicants &&
              applications.length === 0 && (
                <div className="empty-applicants">

                  <div className="empty-icon">
                    👥
                  </div>

                  <h3>
                    No Applicants Yet
                  </h3>

                  <p>
                    Candidates who apply for this
                    job will appear here.
                  </p>

                </div>
              )}

            {/* APPLICANTS LIST */}

            {!loadingApplicants &&
              applications.length > 0 && (
                <div className="applicants-list">

                  {applications.map(
                    (application) => {

                      const candidate =
                        application.candidate ||
                        {};

                      return (
                        <div
                          className="applicant-card"
                          key={
                            application._id
                          }
                        >

                          {/* CANDIDATE INFO */}

                          <div className="candidate-info">

                            <div className="candidate-avatar">
                              {candidate.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "C"}
                            </div>

                            <div>

                              <h3>
                                {candidate.name ||
                                  "Candidate"}
                              </h3>

                              <p>
                                📧{" "}
                                {candidate.email ||
                                  "Email not available"}
                              </p>

                              <p className="application-date">
                                Applied on{" "}
                                {formatDate(
                                  application.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                          {/* APPLICATION STATUS */}

                          <div className="application-status-area">

                            <span
                              className={`status-badge ${getStatusClass(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>

                            <select
                              value={
                                application.status ||
                                "Applied"
                              }
                              onChange={(e) =>
                                updateStatus(
                                  application._id,
                                  e.target.value
                                )
                              }
                              disabled={
                                updatingApplication ===
                                application._id
                              }
                              className="status-select"
                            >

                              <option value="Applied">
                                Applied
                              </option>

                              <option value="Shortlisted">
                                Shortlisted
                              </option>

                              <option value="Interview">
                                Interview
                              </option>

                              <option value="Selected">
                                Selected
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                            </select>

                            {updatingApplication ===
                              application._id && (
                                <span className="updating-text">
                                  Updating...
                                </span>
                              )}

                          </div>

                          {/* APPLICATION ACTIONS */}

                          <div className="applicant-actions">

                            {application.resume ? (
                              <a
                                href={`http://localhost:8001${application.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resume-btn"
                              >
                                📄 View Resume
                              </a>
                            ) : (
                              <span className="no-resume">
                                No Resume
                              </span>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </section>
        )}

      </main>

      {/* ======================================
          STYLES
      ====================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .recruiter-dashboard {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
        }

        /* ================= NAVBAR ================= */

        .navbar {
          height: 72px;
          padding: 0 6%;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          text-decoration: none;
          font-size: 24px;
          font-weight: 800;
          color: #2563eb;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .welcome-text {
          font-size: 14px;
          color: #475569;
          font-weight: 600;
        }

        .create-job-nav-btn,
        .create-job-main-btn {
          text-decoration: none;
          border: none;
          cursor: pointer;
          background: #2563eb;
          color: white;
          font-weight: 700;
          border-radius: 8px;
          transition: 0.2s ease;
        }

        .create-job-nav-btn {
          padding: 10px 16px;
          font-size: 14px;
        }

        .create-job-main-btn {
          display: inline-block;
          padding: 12px 18px;
          font-size: 14px;
        }

        .create-job-nav-btn:hover,
        .create-job-main-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .logout-btn {
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: #f1f5f9;
        }

        /* ================= MAIN ================= */

        .dashboard-container {
          width: 90%;
          max-width: 1400px;
          margin: auto;
          padding: 40px 0 70px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          margin: 0 0 8px;
          font-size: 32px;
        }

        .dashboard-header p {
          margin: 0;
          color: #64748b;
        }

        /* ================= MESSAGES ================= */

        .success-message,
        .error-message {
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
        }

        .success-message {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .error-message {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .close-error {
          margin-left: auto;
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-size: 20px;
        }

        /* ================= SECTION ================= */

        .jobs-section,
        .applicants-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 26px;
          margin-bottom: 30px;
        }

        .section-header,
        .applicants-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .section-header h2,
        .applicants-header h2 {
          margin: 0 0 5px;
          font-size: 23px;
        }

        .section-header p,
        .applicants-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .section-label {
          color: #2563eb !important;
          font-weight: 800 !important;
          font-size: 12px !important;
          letter-spacing: 0.08em;
          margin-bottom: 6px !important;
        }

        .refresh-btn,
        .close-applicants-btn {
          border: 1px solid #e2e8f0;
          background: white;
          padding: 9px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #475569;
        }

        .refresh-btn:hover,
        .close-applicants-btn:hover {
          background: #f8fafc;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ================= JOB GRID ================= */

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .job-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .job-card:hover {
          border-color: #bfdbfe;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.07);
          transform: translateY(-2px);
        }

        .selected-job-card {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #dbeafe;
        }

        .closed-job-card {
          background: #fafafa;
        }

        /* ================= JOB HEADER ================= */

        .job-card-header {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .job-card-header h3 {
          margin: 0 0 6px;
          font-size: 18px;
        }

        .company-name {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .job-badges {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .job-type-badge {
          height: fit-content;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ================= JOB STATUS ================= */

        .job-status-badge {
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .job-status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .job-status-closed {
          background: #fee2e2;
          color: #b91c1c;
        }

        .closed-notice {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          border-radius: 8px;
          padding: 9px 11px;
          margin-bottom: 15px;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================= JOB INFO ================= */

        .job-info {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 15px;
        }

        .info-item {
          display: flex;
          gap: 8px;
          color: #475569;
          font-size: 13px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 15px;
        }

        .skill-tag {
          background: #f1f5f9;
          color: #334155;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .skill-more {
          background: #e2e8f0;
          color: #475569;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }

        .posted-date {
          color: #94a3b8;
          font-size: 12px;
          margin: 0 0 16px;
        }

        /* ================= JOB ACTIONS ================= */

        .job-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }

        .job-actions button,
        .job-actions a {
          min-height: 38px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .applicants-btn {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .applicants-btn:hover,
        .applicants-btn.active {
          background: #2563eb;
          color: white;
        }

        .edit-btn {
          border: 1px solid #fde68a;
          background: #fffbeb;
          color: #b45309;
        }

        .edit-btn:hover {
          background: #fef3c7;
        }

        .close-job-btn {
          border: 1px solid #fed7aa;
          background: #fff7ed;
          color: #c2410c;
        }

        .close-job-btn:hover {
          background: #ffedd5;
        }

        .reopen-job-btn {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #15803d;
        }

        .reopen-job-btn:hover {
          background: #dcfce7;
        }

        .close-job-btn:disabled,
        .reopen-job-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analytics-btn {
          border: 1px solid #ddd6fe;
          background: #f5f3ff;
          color: #6d28d9;
        }

        .analytics-btn:hover {
          background: #ede9fe;
        }

        .all-applicants-btn {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .all-applicants-btn:hover {
          background: #dbeafe;
        }

        .delete-btn {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ================= APPLICANTS ================= */

        .applicant-header-actions {
          display: flex;
          gap: 8px;
        }

        .applicants-section {
          scroll-margin-top: 90px;
        }

        .status-summary {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }

        .summary-card {
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
          text-align: center;
        }

        .summary-number {
          display: block;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 3px;
        }

        .summary-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .applied-summary {
          background: #eff6ff;
        }

        .shortlisted-summary {
          background: #fefce8;
        }

        .interview-summary {
          background: #f5f3ff;
        }

        .selected-summary {
          background: #ecfdf5;
        }

        .rejected-summary {
          background: #fef2f2;
        }

        .applicants-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .applicant-card {
          display: grid;
          grid-template-columns: 1.5fr 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .applicant-card:hover {
          background: #fafcff;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .candidate-avatar {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: #dbeafe;
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .candidate-info h3 {
          margin: 0 0 5px;
          font-size: 15px;
        }

        .candidate-info p {
          margin: 2px 0;
          color: #64748b;
          font-size: 12px;
        }

        .application-date {
          color: #94a3b8 !important;
        }

        .application-status-area {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .status-applied {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-shortlisted {
          background: #fef3c7;
          color: #b45309;
        }

        .status-interview {
          background: #ede9fe;
          color: #6d28d9;
        }

        .status-selected {
          background: #d1fae5;
          color: #047857;
        }

        .status-rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-select {
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 12px;
          cursor: pointer;
          outline: none;
        }

        .status-select:focus {
          border-color: #2563eb;
        }

        .status-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .updating-text {
          color: #64748b;
          font-size: 11px;
        }

        .applicant-actions {
          display: flex;
          justify-content: flex-end;
        }

        .resume-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 9px 13px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .resume-btn:hover {
          background: #e2e8f0;
        }

        .no-resume {
          color: #94a3b8;
          font-size: 12px;
        }

        /* ================= EMPTY ================= */

        .empty-state,
        .empty-applicants {
          text-align: center;
          padding: 55px 20px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .empty-state h3,
        .empty-applicants h3 {
          color: #0f172a;
          margin: 0 0 8px;
          font-size: 20px;
        }

        .empty-state p,
        .empty-applicants p {
          margin: 0 auto 22px;
          max-width: 450px;
          line-height: 1.6;
          font-size: 14px;
        }

        /* ================= LOADING ================= */

        .loading-container {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .spinner {
          width: 35px;
          height: 35px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1200px) {
          .jobs-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .job-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .status-summary {
            grid-template-columns: repeat(3, 1fr);
          }

          .applicant-card {
            grid-template-columns: 1fr 1fr;
          }

          .applicant-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {

          .navbar {
            height: auto;
            padding: 15px 5%;
            gap: 15px;
          }

          .navbar-right {
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .welcome-text {
            display: none;
          }

          .dashboard-container {
            width: 94%;
            padding-top: 25px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .jobs-section,
          .applicants-section {
            padding: 18px;
          }

          .section-header,
          .applicants-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .applicant-header-actions {
            width: 100%;
          }

          .applicant-header-actions button {
            flex: 1;
          }

          .status-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .applicant-card {
            grid-template-columns: 1fr;
          }

          .application-status-area {
            justify-content: flex-start;
          }

          .job-actions {
            grid-template-columns: 1fr;
          }

          .job-card-header {
            flex-direction: column;
          }

          .job-badges {
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {

          .navbar {
            align-items: flex-start;
          }

          .logo {
            font-size: 20px;
          }

          .create-job-nav-btn,
          .logout-btn {
            padding: 8px 10px;
            font-size: 12px;
          }

          .dashboard-header h1 {
            font-size: 26px;
          }

          .status-summary {
            grid-template-columns: 1fr 1fr;
          }

          .candidate-info {
            align-items: flex-start;
          }

          .job-actions {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

    </div>
  );
};

export default RecruiterDashboard;

