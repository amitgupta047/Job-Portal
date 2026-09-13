
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import JobCard from "../components/JobCard";
import NotificationBell from "../components/NotificationBell";

const JOBS_PER_PAGE = 6;

const CandidateDashboard = () => {
  const { user, logout } = useAuth();

  // =========================================================
  // JOB STATE
  // =========================================================

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [skills, setSkills] = useState("");

  // =========================================================
  // SAVED JOB STATE
  // =========================================================
  // Stores only job IDs.
  //
  // Example:
  // Set {
  //   "68abc123...",
  //   "68abc456..."
  // }
  //
  // This allows us to determine whether a job is saved
  // without making a separate API request for every JobCard.
  // =========================================================

  const [savedJobIds, setSavedJobIds] = useState(new Set());

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // FETCH JOBS
  // =========================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      console.log("JOBS RESPONSE:", response.data);

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH SAVED JOBS
  // =========================================================
  //
  // IMPORTANT:
  // We call /saved-jobs ONCE from CandidateDashboard.
  //
  // Previously every JobCard called:
  //
  // /saved-jobs/check/:jobId
  //
  // That created many requests and contributed to 429 errors.
  //
  // Now we get all saved jobs once and create a Set of IDs.
  // =========================================================

  const fetchSavedJobs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSavedJobIds(new Set());
      return;
    }

    try {
      const response = await api.get("/saved-jobs");

      console.log(
        "SAVED JOBS RESPONSE:",
        response.data
      );

      const savedJobs = response.data.savedJobs || [];

      const ids = new Set();

      savedJobs.forEach((item) => {
        const jobId =
          item.job?._id ||
          item.job?.id ||
          item.job;

        if (jobId) {
          ids.add(String(jobId));
        }
      });

      setSavedJobIds(ids);
    } catch (error) {
      console.error(
        "FETCH SAVED JOBS ERROR:",
        error
      );

      // Do not break the entire dashboard
      // if saved jobs fail to load.
      setSavedJobIds(new Set());
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  // =========================================================
  // SAVED JOB CHANGE
  // =========================================================
  //
  // JobCard calls this function after successfully saving
  // or unsaving a job.
  //
  // isSaved = true  -> add job ID
  // isSaved = false -> remove job ID
  // =========================================================

  const handleSavedChange = (jobId, isSaved) => {
    setSavedJobIds((previous) => {
      const updated = new Set(previous);

      const normalizedJobId = String(jobId);

      if (isSaved) {
        updated.add(normalizedJobId);
      } else {
        updated.delete(normalizedJobId);
      }

      return updated;
    });
  };

  // =========================================================
  // FILTER JOBS
  // =========================================================

  const filteredJobs = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    const locationValue =
      location.trim().toLowerCase();

    const skillsValue =
      skills.trim().toLowerCase();

    const min = minSalary
      ? Number(minSalary)
      : null;

    const max = maxSalary
      ? Number(maxSalary)
      : null;

    return jobs.filter((job) => {
      // -----------------------------------------------------
      // SEARCH
      // -----------------------------------------------------

      const title =
        job.title?.toLowerCase() || "";

      const company =
        job.company?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        company.includes(searchValue);

      // -----------------------------------------------------
      // LOCATION
      // -----------------------------------------------------

      const jobLocation =
        job.location?.toLowerCase() || "";

      const matchesLocation =
        !locationValue ||
        jobLocation.includes(locationValue);

      // -----------------------------------------------------
      // JOB TYPE
      // -----------------------------------------------------

      const matchesJobType =
        !jobType ||
        job.jobType === jobType;

      // -----------------------------------------------------
      // SALARY
      // -----------------------------------------------------

      let salaryValue = 0;

      if (typeof job.salary === "number") {
        salaryValue = job.salary;
      } else if (
        typeof job.salary === "string"
      ) {
        salaryValue =
          Number(
            job.salary.replace(/[^\d.]/g, "")
          ) || 0;
      }

      const matchesMinSalary =
        min === null ||
        salaryValue >= min;

      const matchesMaxSalary =
        max === null ||
        salaryValue <= max;

      // -----------------------------------------------------
      // SKILLS
      // -----------------------------------------------------

      let jobSkills = "";

      if (Array.isArray(job.skills)) {
        jobSkills = job.skills
          .join(" ")
          .toLowerCase();
      } else if (
        typeof job.skills === "string"
      ) {
        jobSkills =
          job.skills.toLowerCase();
      }

      const matchesSkills =
        !skillsValue ||
        jobSkills.includes(skillsValue);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesMinSalary &&
        matchesMaxSalary &&
        matchesSkills
      );
    });
  }, [
    jobs,
    search,
    location,
    jobType,
    minSalary,
    maxSalary,
    skills,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredJobs.length / JOBS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    JOBS_PER_PAGE;

  const paginatedJobs =
    filteredJobs.slice(
      startIndex,
      startIndex + JOBS_PER_PAGE
    );

  // =========================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    location,
    jobType,
    minSalary,
    maxSalary,
    skills,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setMinSalary("");
    setMaxSalary("");
    setSkills("");
    setCurrentPage(1);
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="dashboard">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
        }

        .dashboard {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 5% 5%,
              rgba(99, 102, 241, 0.09),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 15%,
              rgba(37, 99, 235, 0.07),
              transparent 30%
            ),
            #f8fafc;

          color: #172033;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }

        /* ============================
           NAVBAR
        ============================ */

        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;

          width: 100%;
          height: 76px;

          display: flex;
          align-items: center;

          background: rgba(255, 255, 255, 0.90);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border-bottom:
            1px solid rgba(226, 232, 240, 0.85);

          box-shadow:
            0 5px 25px rgba(15, 23, 42, 0.045);
        }

        .navbar-inner {
          width: min(90%, 1280px);

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;

          text-decoration: none;

          flex-shrink: 0;
        }

        .brand-icon {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5 55%,
              #7c3aed
            );

          color: white;

          font-size: 20px;

          box-shadow:
            0 9px 22px rgba(79, 70, 229, 0.24);
        }

        .brand-title {
          margin: 0;

          color: #111827;

          font-size: 21px;
          font-weight: 800;

          letter-spacing: -0.5px;
        }

        .nav-right {
          display: flex;
          align-items: center;

          gap: 18px;
        }

        .welcome {
          margin-right: 0;

          padding: 8px 12px;

          color: #64748b;

          font-size: 13px;
          font-weight: 500;

          border-radius: 10px;

          background: #f8fafc;
        }

        .welcome strong {
          color: #111827;
        }

        .applications-link,
        .nav-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 40px;

          padding: 9px 15px;

          border-radius: 10px;

          color: #334155;

          text-decoration: none;

          font-size: 14px;
          font-weight: 650;

          transition: all 0.2s ease;
        }

        .applications-link:hover,
        .nav-link:hover {
          background: #eef2ff;
          color: #4f46e5;
        }

        .logout-button {
          min-height: 40px;

          padding: 9px 17px;

          border:
            1px solid #fecaca;

          border-radius: 10px;

          background: #fff7f7;

          color: #dc2626;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
        }

        /* ============================
           MAIN
        ============================ */

        .main {
          width: min(90%, 1280px);

          margin: 0 auto;

          padding:
            48px
            0
            80px;
        }

        /* ============================
           HERO
        ============================ */

        .hero {
          position: relative;

          min-height: 220px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 30px;

          padding: 45px;

          overflow: hidden;

          border:
            1px solid rgba(99, 102, 241, 0.10);

          border-radius: 26px;

          background:
            linear-gradient(
              135deg,
              #eef4ff 0%,
              #f3f1ff 52%,
              #ffffff 100%
            );

          box-shadow:
            0 16px 45px rgba(15, 23, 42, 0.055);
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-label {
          display: inline-flex;

          margin-bottom: 14px;

          padding: 6px 11px;

          border-radius: 999px;

          background: rgba(255, 255, 255, 0.78);

          color: #4f46e5;

          font-size: 12px;
          font-weight: 750;
        }

        .hero h1 {
          margin: 0 0 10px;

          color: #0f172a;

          font-size: clamp(30px, 4vw, 42px);

          line-height: 1.1;

          font-weight: 850;

          letter-spacing: -1.2px;
        }

        .subtitle {
          max-width: 610px;

          margin: 0;

          color: #64748b;

          font-size: 15px;

          line-height: 1.7;
        }

        .job-count-wrapper {
          position: relative;
          z-index: 2;

          flex-shrink: 0;
        }

        .job-count {
          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          min-width: 150px;
          min-height: 110px;

          padding: 18px;

          border-radius: 18px;

          background:
            rgba(255, 255, 255, 0.76);

          box-shadow:
            0 10px 30px rgba(79, 70, 229, 0.08);
        }

        .job-count-number {
          color: #4f46e5;

          font-size: 30px;
          font-weight: 850;
        }

        .job-count-label {
          margin-top: 8px;

          color: #64748b;

          font-size: 12px;
          font-weight: 650;
        }

        /* ============================
           FILTER PANEL
        ============================ */

        .filters {
          margin-bottom: 30px;

          padding: 24px;

          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 20px;

          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.045);
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .filters-title {
          margin: 0;

          color: #111827;

          font-size: 18px;
          font-weight: 800;
        }

        .clear-button {
          border: none;

          background: transparent;

          color: #4f46e5;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
        }

        .clear-button:hover {
          text-decoration: underline;
        }

        .filter-grid {
          display: grid;

          grid-template-columns:
            2fr
            1fr
            1fr
            1fr
            1fr
            1.4fr;

          gap: 14px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .filter-group label {
          color: #475569;

          font-size: 12px;
          font-weight: 700;
        }

        .filter-input,
        .filter-select {
          width: 100%;

          min-height: 44px;

          padding:
            10px
            12px;

          border:
            1px solid #dbe3ef;

          border-radius: 10px;

          outline: none;

          background: #f8fafc;

          color: #1e293b;

          font-size: 13px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          border-color: #818cf8;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.10);
        }

        .salary-fields {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 8px;
        }

        /* ============================
           SECTION
        ============================ */

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .section-title {
          margin: 0;

          color: #111827;

          font-size: 20px;
          font-weight: 800;
        }

        .section-subtitle {
          margin: 4px 0 0;

          color: #94a3b8;

          font-size: 13px;
        }

        .jobs-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 24px;
        }

        .job-wrapper {
          min-width: 0;

          transition:
            transform 0.25s ease;
        }

        .job-wrapper:hover {
          transform: translateY(-6px);
        }

        /* ============================
           LOADING
        ============================ */

        .loading-container {
          min-height: 380px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-box {
          width: min(100%, 420px);

          padding: 42px 35px;

          text-align: center;

          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 22px;

          box-shadow:
            0 15px 45px rgba(15, 23, 42, 0.07);
        }

        .spinner {
          width: 48px;
          height: 48px;

          margin: 0 auto 20px;

          border:
            4px solid #e2e8f0;

          border-top-color: #4f46e5;

          border-radius: 50%;

          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-box h3 {
          margin: 0 0 7px;

          color: #1e293b;

          font-size: 18px;
        }

        .loading-box p {
          margin: 0;

          color: #94a3b8;

          font-size: 13px;
        }

        /* ============================
           ERROR
        ============================ */

        .error-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 25px;

          padding: 16px 18px;

          border:
            1px solid #fecaca;

          border-radius: 14px;

          background: #fff7f7;

          color: #b91c1c;

          font-size: 14px;
        }

        .retry-button {
          border:
            1px solid #fca5a5;

          background: white;

          color: #dc2626;

          padding: 9px 17px;

          border-radius: 9px;

          cursor: pointer;

          font-size: 13px;
          font-weight: 700;
        }

        .retry-button:hover {
          background: #dc2626;
          color: white;
        }

        /* ============================
           EMPTY STATE
        ============================ */

        .empty-state {
          padding: 80px 25px;

          text-align: center;

          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 22px;

          box-shadow:
            0 10px 35px rgba(15, 23, 42, 0.05);
        }

        .empty-icon {
          width: 78px;
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 20px;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #f5f3ff
            );

          font-size: 31px;
        }

        .empty-state h3 {
          margin: 0 0 9px;

          color: #111827;

          font-size: 21px;
        }

        .empty-state p {
          max-width: 470px;

          margin: 0 auto;

          color: #64748b;

          font-size: 14px;

          line-height: 1.6;
        }

        /* ============================
           PAGINATION
        ============================ */

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          margin-top: 35px;
        }

        .page-button {
          min-width: 40px;
          height: 40px;

          padding: 0 12px;

          border:
            1px solid #dbe3ef;

          border-radius: 9px;

          background: white;

          color: #475569;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .page-button:hover:not(:disabled) {
          border-color: #818cf8;

          color: #4f46e5;

          background: #eef2ff;
        }

        .page-button.active {
          border-color: #4f46e5;

          background: #4f46e5;

          color: white;
        }

        .page-button:disabled {
          opacity: 0.45;

          cursor: not-allowed;
        }

        .results-info {
          margin-top: 14px;

          text-align: center;

          color: #94a3b8;

          font-size: 12px;
        }

        /* ============================
           RESPONSIVE
        ============================ */

        @media (max-width: 1100px) {
          .navbar-inner,
          .main {
            width: 92%;
          }

          .filter-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .jobs-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .navbar {
            height: auto;
            min-height: 70px;

            padding: 12px 0;
          }

          .navbar-inner {
            width: 92%;
          }

          .brand-title {
            font-size: 18px;
          }

          .welcome {
            display: none;
          }

          .nav-right {
            gap: 10px;
          }

          .applications-link,
          .nav-link {
            min-height: 36px;

            padding:
              8px
              10px;

            font-size: 12px;
          }

          .logout-button {
            min-height: 36px;

            padding:
              8px
              11px;

            font-size: 12px;
          }

          .main {
            width: 92%;

            padding:
              30px
              0
              55px;
          }

          .hero {
            flex-direction: column;

            align-items: flex-start;

            padding: 30px 25px;

            border-radius: 21px;
          }

          .hero h1 {
            font-size: 29px;
          }

          .job-count-wrapper {
            width: 100%;
          }

          .job-count {
            flex-direction: row;

            width: fit-content;

            min-width: auto;
            min-height: auto;

            gap: 10px;

            padding: 10px 14px;
          }

          .job-count-number {
            font-size: 20px;
          }

          .job-count-label {
            margin-top: 0;
          }

          .filters {
            padding: 18px;
          }

          .filters-header {
            align-items: flex-start;
          }

          .filter-grid {
            grid-template-columns: 1fr;
          }

          .jobs-grid {
            grid-template-columns: 1fr;

            gap: 18px;
          }

          .error-box {
            align-items: flex-start;

            flex-direction: column;
          }

          .retry-button {
            width: 100%;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 420px) {
          .brand-title {
            font-size: 16px;
          }

          .applications-link,
          .nav-link {
            font-size: 11px;
          }

          .logout-button {
            font-size: 11px;
          }

          .hero {
            padding: 27px 20px;
          }

          .hero h1 {
            font-size: 25px;
          }

          .section-title {
            font-size: 18px;
          }

          .page-button {
            min-width: 36px;
            height: 36px;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">
        <div className="navbar-inner">
          <Link
            to="/"
            className="brand"
          >
            <div className="brand-icon">
              💼
            </div>

            <h2 className="brand-title">
              Job Portal
            </h2>
          </Link>

          <div className="nav-right">
            <span className="welcome">
              Welcome{" "}
              <strong>
                {user?.name || "Candidate"}
              </strong>
            </span>

            <Link
              to="/my-applications"
              className="applications-link"
            >
              My Applications
            </Link>

            <NotificationBell />

            <Link
              to="/profile"
              className="nav-link"
            >
              My Profile
            </Link>

            <button
              type="button"
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">
              ✨ Career Opportunities
            </span>

            <h1>
              Find Your Next Job
            </h1>

            <p className="subtitle">
              Explore exciting opportunities from top
              companies and find the role that matches
              your skills and career goals.
            </p>
          </div>

          {!loading && !error && (
            <div className="job-count-wrapper">
              <div className="job-count">
                <span className="job-count-number">
                  {filteredJobs.length}
                </span>

                <span className="job-count-label">
                  {filteredJobs.length === 1
                    ? "Job Found"
                    : "Jobs Found"}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div
            className="loading-container"
            role="status"
            aria-live="polite"
          >
            <div className="loading-box">
              <div className="spinner"></div>

              <h3>
                Finding opportunities...
              </h3>

              <p>
                Please wait while we load the latest jobs.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="error-box"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              className="retry-button"
              onClick={fetchJobs}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            FILTERS
        =================================================== */}

        {!loading &&
          !error &&
          jobs.length > 0 && (
            <section className="filters">
              <div className="filters-header">
                <h2 className="filters-title">
                  🔎 Find the right job
                </h2>

                <button
                  type="button"
                  className="clear-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>

              <div className="filter-grid">
                {/* Search */}

                <div className="filter-group">
                  <label>
                    Search
                  </label>

                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Job title or company..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

                {/* Location */}

                <div className="filter-group">
                  <label>
                    📍 Location
                  </label>

                  <input
                    type="text"
                    className="filter-input"
                    placeholder="e.g. Lucknow"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />
                </div>

                {/* Job Type */}

                <div className="filter-group">
                  <label>
                    💼 Job Type
                  </label>

                  <select
                    className="filter-select"
                    value={jobType}
                    onChange={(e) =>
                      setJobType(e.target.value)
                    }
                  >
                    <option value="">
                      All Types
                    </option>

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Remote">
                      Remote
                    </option>

                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </div>

                {/* Min Salary */}

                <div className="filter-group">
                  <label>
                    💰 Min Salary
                  </label>

                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Min"
                    min="0"
                    value={minSalary}
                    onChange={(e) =>
                      setMinSalary(e.target.value)
                    }
                  />
                </div>

                {/* Max Salary */}

                <div className="filter-group">
                  <label>
                    💰 Max Salary
                  </label>

                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Max"
                    min="0"
                    value={maxSalary}
                    onChange={(e) =>
                      setMaxSalary(e.target.value)
                    }
                  />
                </div>

                {/* Skills */}

                <div className="filter-group">
                  <label>
                    🛠️ Skills
                  </label>

                  <input
                    type="text"
                    className="filter-input"
                    placeholder="e.g. React"
                    value={skills}
                    onChange={(e) =>
                      setSkills(e.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          )}

        {/* ===================================================
            NO RESULTS
        =================================================== */}

        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                🔍
              </div>

              <h3>
                {jobs.length === 0
                  ? "No jobs available right now"
                  : "No jobs match your filters"}
              </h3>

              <p>
                {jobs.length === 0
                  ? "New opportunities will appear here when recruiters post jobs. Check back soon."
                  : "Try changing your search or filters to find more opportunities."}
              </p>

              {jobs.length > 0 && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={clearFilters}
                  style={{
                    marginTop: "18px",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

        {/* ===================================================
            JOBS
        =================================================== */}

        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <section aria-label="Available jobs">
              <div className="section-header">
                <div>
                  <h2 className="section-title">
                    Latest Opportunities
                  </h2>

                  <p className="section-subtitle">
                    Showing{" "}
                    {startIndex + 1}
                    {" - "}
                    {Math.min(
                      startIndex +
                        JOBS_PER_PAGE,
                      filteredJobs.length
                    )}
                    {" of "}
                    {filteredJobs.length}
                    {" jobs"}
                  </p>
                </div>
              </div>

              <div className="jobs-grid">
                {paginatedJobs.map((job) => (
                  <div
                    className="job-wrapper"
                    key={job._id}
                  >
                    <JobCard
                      job={job}
                      isSaved={savedJobIds.has(
                        String(job._id)
                      )}
                      onSavedChange={
                        handleSavedChange
                      }
                    />
                  </div>
                ))}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (
                <>
                  <div className="pagination">
                    <button
                      type="button"
                      className="page-button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        goToPage(
                          currentPage - 1
                        )
                      }
                    >
                      ←
                    </button>

                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        className={`page-button ${
                          currentPage === page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="page-button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        goToPage(
                          currentPage + 1
                        )
                      }
                    >
                      →
                    </button>
                  </div>

                  <div className="results-info">
                    Page {currentPage} of{" "}
                    {totalPages}
                  </div>
                </>
              )}
            </section>
          )}
      </main>
    </div>
  );
};

export default CandidateDashboard;

