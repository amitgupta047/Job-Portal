
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const RecruiterApplicants = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [status, setStatus] = useState(
    searchParams.get("status") || ""
  );

  const [jobId, setJobId] = useState(
    searchParams.get("jobId") || ""
  );

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const limit = 10;

  const backendUrl = "http://localhost:8001";

  // ========================================
  // FETCH RECRUITER JOBS
  // ========================================

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await api.get("/jobs");

      const jobList = response.data.jobs || [];

      setJobs(jobList);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  // ========================================
  // FETCH APPLICANTS
  // ========================================

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (jobId) {
        params.jobId = jobId;
      }

      const response = await api.get(
        "/applications/recruiter-applicants",
        {
          params,
        }
      );

      const data = response.data;

      setApplicants(data.applicants || []);

      setTotalApplicants(
        data.totalApplicants ||
          data.total ||
          data.count ||
          0
      );

      setTotalPages(
        data.totalPages ||
          Math.max(
            1,
            Math.ceil(
              (data.totalApplicants ||
                data.total ||
                0) / limit
            )
          )
      );
    } catch (error) {
      console.error(
        "FETCH RECRUITER APPLICANTS ERROR:",
        error
      );

      setApplicants([]);

      setError(
        error.response?.data?.message ||
          "Failed to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // ========================================
  // FETCH APPLICANTS
  // ========================================

  useEffect(() => {
    fetchApplicants();
  }, [page, searchParams]);

  // ========================================
  // UPDATE URL
  // ========================================

  const updateFilters = (
    newSearch,
    newStatus,
    newJobId,
    newPage = 1
  ) => {
    const params = {};

    if (newSearch.trim()) {
      params.search = newSearch.trim();
    }

    if (newStatus) {
      params.status = newStatus;
    }

    if (newJobId) {
      params.jobId = newJobId;
    }

    if (newPage > 1) {
      params.page = newPage;
    }

    setSearchParams(params);
  };

  // ========================================
  // SEARCH
  // ========================================

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);

    updateFilters(
      search,
      status,
      jobId,
      1
    );
  };

  // ========================================
  // STATUS FILTER
  // ========================================

  const handleStatusChange = (event) => {
    const value = event.target.value;

    setStatus(value);
    setPage(1);

    updateFilters(
      search,
      value,
      jobId,
      1
    );
  };

  // ========================================
  // JOB FILTER
  // ========================================

  const handleJobChange = (event) => {
    const value = event.target.value;

    setJobId(value);
    setPage(1);

    updateFilters(
      search,
      status,
      value,
      1
    );
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setJobId("");
    setPage(1);

    setSearchParams({});
  };

  // ========================================
  // STATUS UPDATE
  // ========================================

  const handleStatusUpdate = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setSuccess(
          "Application status updated successfully."
        );

        setApplicants((previous) =>
          previous.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status: newStatus,
                }
              : application
          )
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      }
    } catch (error) {
      console.error(
        "UPDATE APPLICATION STATUS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // VIEW PROFILE
  // ========================================

  const handleViewProfile = (applicationId) => {
    navigate(
      `/candidate-profile/${applicationId}`
    );
  };

  // ========================================
  // VIEW RESUME
  // ========================================

  const handleViewResume = (resume) => {
    if (!resume) {
      setError("Resume is not available.");
      return;
    }

    window.open(
      `${backendUrl}${resume}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ========================================
  // PAGINATION
  // ========================================

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);

    updateFilters(
      search,
      status,
      jobId,
      newPage
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (applicationStatus) => {
    switch (applicationStatus) {
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
        return "status-default";
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading && applicants.length === 0) {
    return (
      <>
        <style>{`
          .app-loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #f5f7fb;
            font-family: Arial, Helvetica, sans-serif;
            color: #374151;
          }

          .app-loader {
            width: 45px;
            height: 45px;
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: appSpin 0.8s linear infinite;
            margin-bottom: 18px;
          }

          @keyframes appSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="app-loading-page">
          <div className="app-loader"></div>
          <h2>Loading applicants...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f7fb;
        }

        .applicants-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding-bottom: 50px;
        }

        /* ========================================
           NAVBAR
        ======================================== */

        .applicants-navbar {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 6%;
        }

        .applicants-navbar h2 {
          margin: 0;
          color: #2563eb;
          font-size: 23px;
        }

        .dashboard-btn {
          border: none;
          background: #2563eb;
          color: #ffffff;

          padding: 10px 18px;
          border-radius: 7px;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
          transition: 0.2s;
        }

        .dashboard-btn:hover {
          background: #1d4ed8;
        }

        /* ========================================
           CONTAINER
        ======================================== */

        .applicants-container {
          width: 92%;
          max-width: 1250px;
          margin: 35px auto;
        }

        .page-header {
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 31px;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        /* ========================================
           ALERTS
        ======================================== */

        .alert {
          padding: 13px 16px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .alert-success {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }

        /* ========================================
           FILTERS
        ======================================== */

        .filters-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.06);

          margin-bottom: 25px;
        }

        .filters-form {
          display: grid;
          grid-template-columns:
            minmax(220px, 2fr)
            minmax(170px, 1fr)
            minmax(170px, 1fr)
            auto
            auto;

          gap: 12px;
          align-items: end;
        }

        .filter-group label {
          display: block;
          margin-bottom: 7px;

          color: #374151;
          font-size: 13px;
          font-weight: 600;
        }

        .filter-group input,
        .filter-group select {
          width: 100%;

          padding: 11px 12px;

          border: 1px solid #d1d5db;
          border-radius: 7px;

          background: #ffffff;
          color: #111827;

          font-size: 14px;
          outline: none;
        }

        .filter-group input:focus,
        .filter-group select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-btn {
          padding: 11px 18px;

          border: none;
          border-radius: 7px;

          background: #2563eb;
          color: #ffffff;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        .search-btn:hover {
          background: #1d4ed8;
        }

        .clear-btn {
          padding: 10px 17px;

          border: 1px solid #d1d5db;
          border-radius: 7px;

          background: #ffffff;
          color: #374151;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        .clear-btn:hover {
          background: #f3f4f6;
        }

        /* ========================================
           SUMMARY
        ======================================== */

        .summary-card {
          background: #ffffff;
          border-radius: 10px;

          padding: 16px 20px;

          margin-bottom: 20px;

          border: 1px solid #e5e7eb;
        }

        .summary-card strong {
          color: #111827;
        }

        .summary-card span {
          color: #6b7280;
        }

        /* ========================================
           APPLICANTS
        ======================================== */

        .applicants-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .applicant-card {
          background: #ffffff;

          border-radius: 12px;

          padding: 22px;

          border: 1px solid #e5e7eb;

          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.05);
        }

        .applicant-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .candidate-info {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .candidate-avatar {
          width: 52px;
          height: 52px;

          border-radius: 50%;

          background: #dbeafe;
          color: #1d4ed8;

          display: flex;
          justify-content: center;
          align-items: center;

          font-size: 20px;
          font-weight: 700;

          flex-shrink: 0;
        }

        .candidate-info h3 {
          margin: 0 0 6px;

          color: #111827;
          font-size: 18px;
        }

        .candidate-email {
          margin: 0 0 5px;

          color: #6b7280;
          font-size: 14px;
        }

        .applied-job {
          margin: 0;

          color: #374151;
          font-size: 14px;
        }

        .applied-job strong {
          color: #2563eb;
        }

        /* ========================================
           STATUS
        ======================================== */

        .status-badge {
          display: inline-block;

          padding: 6px 11px;

          border-radius: 20px;

          font-size: 12px;
          font-weight: 700;

          white-space: nowrap;
        }

        .status-applied {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-shortlisted {
          background: #fef3c7;
          color: #92400e;
        }

        .status-interview {
          background: #ede9fe;
          color: #6d28d9;
        }

        .status-selected {
          background: #dcfce7;
          color: #15803d;
        }

        .status-rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status-default {
          background: #f3f4f6;
          color: #374151;
        }

        /* ========================================
           DETAILS
        ======================================== */

        .applicant-details {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;

          margin-top: 20px;

          padding-top: 18px;

          border-top: 1px solid #e5e7eb;
        }

        .detail-item span {
          display: block;

          color: #9ca3af;

          font-size: 12px;

          margin-bottom: 4px;
        }

        .detail-item strong {
          color: #374151;

          font-size: 14px;
        }

        /* ========================================
           ACTIONS
        ======================================== */

        .applicant-actions {
          display: flex;

          flex-wrap: wrap;

          gap: 10px;

          margin-top: 20px;
        }

        .action-btn {
          padding: 9px 14px;

          border-radius: 7px;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .profile-btn {
          border: none;
          background: #2563eb;
          color: #ffffff;
        }

        .profile-btn:hover {
          background: #1d4ed8;
        }

        .resume-btn {
          border: 1px solid #2563eb;
          background: #ffffff;
          color: #2563eb;
        }

        .resume-btn:hover {
          background: #eff6ff;
        }

        .status-select {
          min-width: 145px;

          padding: 9px 12px;

          border: 1px solid #d1d5db;
          border-radius: 7px;

          background: #ffffff;
          color: #374151;

          font-size: 13px;
          font-weight: 600;

          outline: none;

          cursor: pointer;
        }

        .status-select:focus {
          border-color: #2563eb;
        }

        .status-select:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        /* ========================================
           EMPTY
        ======================================== */

        .empty-state {
          background: #ffffff;

          padding: 60px 25px;

          border-radius: 12px;

          text-align: center;

          border: 1px solid #e5e7eb;
        }

        .empty-state-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .empty-state h2 {
          margin: 0 0 8px;

          color: #111827;
          font-size: 22px;
        }

        .empty-state p {
          margin: 0;

          color: #6b7280;
          font-size: 14px;
        }

        /* ========================================
           PAGINATION
        ======================================== */

        .pagination {
          display: flex;

          justify-content: center;
          align-items: center;

          gap: 8px;

          margin-top: 30px;
        }

        .page-btn {
          min-width: 38px;
          height: 38px;

          border: 1px solid #d1d5db;

          border-radius: 7px;

          background: #ffffff;
          color: #374151;

          cursor: pointer;

          font-size: 14px;
          font-weight: 600;
        }

        .page-btn:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #2563eb;
          color: #2563eb;
        }

        .page-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #6b7280;
          font-size: 13px;

          margin: 0 8px;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 1000px) {
          .filters-form {
            grid-template-columns:
              1fr 1fr;
          }

          .applicant-details {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .applicants-navbar {
            padding: 0 20px;
          }

          .applicants-navbar h2 {
            font-size: 18px;
          }

          .applicants-container {
            width: 94%;
            margin-top: 25px;
          }

          .page-header h1 {
            font-size: 26px;
          }

          .filters-form {
            grid-template-columns: 1fr;
          }

          .applicant-top {
            flex-direction: column;
          }

          .candidate-info {
            width: 100%;
          }

          .applicant-details {
            grid-template-columns: 1fr;
          }

          .applicant-actions {
            flex-direction: column;
          }

          .action-btn,
          .status-select {
            width: 100%;
          }
        }
      `}</style>

      <div className="applicants-page">

        {/* ========================================
            NAVBAR
        ======================================== */}

        <nav className="applicants-navbar">

          <h2>
            Job Portal - Recruiter
          </h2>

          <button
            type="button"
            className="dashboard-btn"
            onClick={() =>
              navigate("/recruiter-dashboard")
            }
          >
            Back to Dashboard
          </button>

        </nav>

        {/* ========================================
            MAIN
        ======================================== */}

        <main className="applicants-container">

          <div className="page-header">

            <h1>
              Recruiter Applicants
            </h1>

            <p>
              Manage candidates who applied to your jobs.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* ========================================
              FILTERS
          ======================================== */}

          <div className="filters-card">

            <form
              className="filters-form"
              onSubmit={handleSearch}
            >

              {/* SEARCH */}

              <div className="filter-group">

                <label>
                  Search Candidate
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Name, email, or job title..."
                />

              </div>

              {/* STATUS */}

              <div className="filter-group">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={handleStatusChange}
                >

                  <option value="">
                    All Statuses
                  </option>

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

              </div>

              {/* JOB */}

              <div className="filter-group">

                <label>
                  Job
                </label>

                <select
                  value={jobId}
                  onChange={handleJobChange}
                  disabled={jobsLoading}
                >

                  <option value="">
                    All Jobs
                  </option>

                  {jobs.map((job) => (
                    <option
                      key={job._id}
                      value={job._id}
                    >
                      {job.title}
                    </option>
                  ))}

                </select>

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                className="search-btn"
              >
                Search
              </button>

              {/* CLEAR */}

              <button
                type="button"
                className="clear-btn"
                onClick={handleClearFilters}
              >
                Clear
              </button>

            </form>

          </div>

          {/* ========================================
              SUMMARY
          ======================================== */}

          <div className="summary-card">

            <strong>
              {totalApplicants}
            </strong>

            <span>
              {" "}total applicant
              {totalApplicants !== 1
                ? "s"
                : ""}
            </span>

          </div>

          {/* ========================================
              APPLICANT LIST
          ======================================== */}

          {applicants.length === 0 ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                👥
              </div>

              <h2>
                No Applicants Found
              </h2>

              <p>
                No candidates match your current
                search or filters.
              </p>

            </div>

          ) : (

            <div className="applicants-list">

              {applicants.map((application) => {

                const candidate =
                  application.candidate || {};

                const job =
                  application.job || {};

                const candidateName =
                  candidate.name ||
                  "Unknown Candidate";

                const initials =
                  candidateName
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0)
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                return (
                  <div
                    className="applicant-card"
                    key={application._id}
                  >

                    {/* TOP */}

                    <div className="applicant-top">

                      <div className="candidate-info">

                        <div className="candidate-avatar">
                          {initials}
                        </div>

                        <div>

                          <h3>
                            {candidateName}
                          </h3>

                          <p className="candidate-email">
                            {candidate.email ||
                              "Email not available"}
                          </p>

                          <p className="applied-job">

                            Applied for{" "}

                            <strong>
                              {job.title ||
                                "Job not available"}
                            </strong>

                          </p>

                        </div>

                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status ||
                          "Applied"}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="applicant-details">

                      <div className="detail-item">

                        <span>
                          Company
                        </span>

                        <strong>
                          {job.company ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="detail-item">

                        <span>
                          Location
                        </span>

                        <strong>
                          {job.location ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="detail-item">

                        <span>
                          Applied On
                        </span>

                        <strong>
                          {formatDate(
                            application.createdAt
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="applicant-actions">

                      {/* PROFILE */}

                      <button
                        type="button"
                        className="action-btn profile-btn"
                        onClick={() =>
                          handleViewProfile(
                            application._id
                          )
                        }
                      >
                        View Profile
                      </button>

                      {/* RESUME */}

                      <button
                        type="button"
                        className="action-btn resume-btn"
                        onClick={() =>
                          handleViewResume(
                            application.resume
                          )
                        }
                      >
                        View Resume
                      </button>

                      {/* STATUS */}

                      <select
                        className="status-select"
                        value={
                          application.status ||
                          "Applied"
                        }
                        disabled={
                          updatingId ===
                          application._id
                        }
                        onChange={(event) =>
                          handleStatusUpdate(
                            application._id,
                            event.target.value
                          )
                        }
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

                    </div>

                  </div>
                );
              })}

            </div>
          )}

          {/* ========================================
              PAGINATION
          ======================================== */}

          {totalPages > 1 && (

            <div className="pagination">

              <button
                type="button"
                className="page-btn"
                disabled={page === 1}
                onClick={() =>
                  handlePageChange(page - 1)
                }
              >
                ‹
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1
              ).map((pageNumber) => (

                <button
                  type="button"
                  key={pageNumber}
                  className={`page-btn ${
                    page === pageNumber
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>

              ))}

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                className="page-btn"
                disabled={page === totalPages}
                onClick={() =>
                  handlePageChange(page + 1)
                }
              >
                ›
              </button>

            </div>

          )}

        </main>

      </div>
    </>
  );
};

export default RecruiterApplicants;

