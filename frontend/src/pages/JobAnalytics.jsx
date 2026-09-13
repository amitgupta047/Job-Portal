import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const JobAnalytics = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH JOB ANALYTICS
  // ========================================

  const fetchJobAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/recruiter/job-analytics/${jobId}`
      );

      setJob(response.data.job);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error(
        "FETCH JOB ANALYTICS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load job analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ANALYTICS
  // ========================================

  useEffect(() => {
    if (jobId) {
      fetchJobAnalytics();
    }
  }, [jobId]);

  // ========================================
  // GET PERCENTAGE
  // ========================================

  const getPercentage = (value, total) => {
    if (!total || total <= 0) {
      return 0;
    }

    return Math.round(
      (value / total) * 100
    );
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="analytics-loading">

        <div className="spinner"></div>

        <p>
          Loading job analytics...
        </p>

        <style>{`
          .analytics-loading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            background: #f8fafc;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #475569;
          }

          .spinner {
            width: 42px;
            height: 42px;

            border: 4px solid #e2e8f0;
            border-top-color: #2563eb;

            border-radius: 50%;

            animation:
              analyticsSpin
              0.8s
              linear
              infinite;

            margin-bottom: 15px;
          }

          @keyframes analyticsSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="analytics-error-page">

        <div className="error-box">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Analytics
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/recruiter-dashboard"
            className="back-btn"
          >
            ← Back to Dashboard
          </Link>

        </div>

        <style>{`
          .analytics-error-page {
            min-height: 100vh;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #f8fafc;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            padding: 20px;
          }

          .error-box {
            max-width: 500px;
            width: 100%;

            padding: 35px;

            text-align: center;

            background: white;

            border:
              1px solid #fecaca;

            border-radius: 14px;

            box-shadow:
              0 8px 25px
              rgba(15, 23, 42, 0.08);
          }

          .error-icon {
            font-size: 42px;
            margin-bottom: 10px;
          }

          .error-box h2 {
            margin: 0 0 10px;
            color: #b91c1c;
          }

          .error-box p {
            color: #64748b;
            margin-bottom: 25px;
          }

          .back-btn {
            display: inline-block;

            text-decoration: none;

            background: #2563eb;

            color: white;

            padding: 11px 18px;

            border-radius: 8px;

            font-weight: 600;
          }

          .back-btn:hover {
            background: #1d4ed8;
          }
        `}</style>

      </div>
    );
  }

  // ========================================
  // SAFETY CHECK
  // ========================================

  if (!job || !analytics) {
    return null;
  }

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
  // STATUS PERCENTAGE
  // ========================================

  const appliedPercentage = getPercentage(
    analytics.applied,
    analytics.totalApplications
  );

  const shortlistedPercentage =
    getPercentage(
      analytics.shortlisted,
      analytics.applied
    );

  const interviewPercentage =
    getPercentage(
      analytics.interview,
      analytics.shortlisted
    );

  const selectedPercentage =
    getPercentage(
      analytics.selected,
      analytics.interview
    );

  const overallSelectionRate =
    getPercentage(
      analytics.selected,
      analytics.totalApplications
    );

  // ========================================
  // STATUS CARDS
  // ========================================

  const statusCards = [
    {
      label: "Applied",
      value: analytics.applied,
      percentage: appliedPercentage,
      description: `${analytics.applied} of ${analytics.totalApplications} applications`,
      className: "applied",
    },
    {
      label: "Shortlisted",
      value: analytics.shortlisted,
      percentage: getPercentage(
        analytics.shortlisted,
        analytics.totalApplications
      ),
      description: `${analytics.shortlisted} of ${analytics.totalApplications} applications`,
      className: "shortlisted",
    },
    {
      label: "Interview",
      value: analytics.interview,
      percentage: getPercentage(
        analytics.interview,
        analytics.totalApplications
      ),
      description: `${analytics.interview} of ${analytics.totalApplications} applications`,
      className: "interview",
    },
    {
      label: "Selected",
      value: analytics.selected,
      percentage: getPercentage(
        analytics.selected,
        analytics.totalApplications
      ),
      description: `${analytics.selected} of ${analytics.totalApplications} applications`,
      className: "selected",
    },
    {
      label: "Rejected",
      value: analytics.rejected,
      percentage: getPercentage(
        analytics.rejected,
        analytics.totalApplications
      ),
      description: `${analytics.rejected} of ${analytics.totalApplications} applications`,
      className: "rejected",
    },
  ];

  return (
    <div className="job-analytics-page">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <nav className="analytics-navbar">

        <Link
          to="/recruiter-dashboard"
          className="analytics-logo"
        >
          JobPortal
        </Link>

        <Link
          to="/recruiter-dashboard"
          className="dashboard-btn"
        >
          ← Dashboard
        </Link>

      </nav>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="analytics-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="analytics-header">

          <div>

            <p className="page-label">
              JOB-WISE ANALYTICS
            </p>

            <h1>
              {job.title}
            </h1>

            <p className="company">
              🏢 {job.company}
            </p>

          </div>

          <div className="analytics-header-actions">

            <Link
              to={`/recruiter-applicants?jobId=${job._id}`}
              className="view-applicants-btn"
            >
              👥 View Applicants
            </Link>

            <button
              type="button"
              onClick={fetchJobAnalytics}
              className="refresh-btn"
            >
              🔄 Refresh
            </button>

          </div>

        </div>

        {/* ========================================
            JOB DETAILS
        ======================================== */}

        <section className="job-details-card">

          <div className="job-detail">

            <span>
              📍 Location
            </span>

            <strong>
              {job.location || "N/A"}
            </strong>

          </div>

          <div className="job-detail">

            <span>
              💼 Job Type
            </span>

            <strong>
              {job.jobType || "N/A"}
            </strong>

          </div>

          <div className="job-detail">

            <span>
              🧑‍💻 Experience
            </span>

            <strong>
              {job.experience || "N/A"}
            </strong>

          </div>

          <div className="job-detail">

            <span>
              📅 Posted On
            </span>

            <strong>
              {formatDate(job.createdAt)}
            </strong>

          </div>

          <div className="job-detail">

            <span>
              📌 Status
            </span>

            <strong
              className={
                job.status === "Closed"
                  ? "closed-status"
                  : "active-status"
              }
            >
              {job.status || "Active"}
            </strong>

          </div>

        </section>

        {/* ========================================
            TOTAL APPLICATIONS
        ======================================== */}

        <section className="total-card">

          <div>

            <p>
              Total Applications
            </p>

            <h2>
              {analytics.totalApplications}
            </h2>

            <span className="total-description">
              Applications received for this job
            </span>

          </div>

          <div className="total-icon">
            👥
          </div>

        </section>

        {/* ========================================
            APPLICATION BREAKDOWN
        ======================================== */}

        <section>

          <div className="breakdown-header">

            <div>

              <h2>
                Application Breakdown
              </h2>

              <p>
                Current application status for this job
              </p>

            </div>

          </div>

          {/* STATUS GRID */}

          <div className="status-grid">

            {statusCards.map((item) => (

              <div
                className={`status-card ${item.className}`}
                key={item.label}
              >

                <div className="status-card-top">

                  <p>
                    {item.label}
                  </p>

                  <span>
                    {item.percentage}%
                  </span>

                </div>

                <h2>
                  {item.value}
                </h2>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${item.percentage}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {item.description}
                </small>

              </div>

            ))}

          </div>

        </section>

        {/* ========================================
            HIRING FUNNEL
        ======================================== */}

        <section className="funnel-section">

          <div className="breakdown-header">

            <div>

              <h2>
                Hiring Funnel
              </h2>

              <p>
                Track how candidates move through the hiring process
              </p>

            </div>

          </div>

          <div className="funnel-card">

            {/* APPLIED */}

            <div className="funnel-step">

              <div className="funnel-icon applied-icon">
                1
              </div>

              <div className="funnel-content">

                <div className="funnel-top">

                  <div>

                    <h3>
                      Applied
                    </h3>

                    <p>
                      Candidates who applied
                    </p>

                  </div>

                  <strong>
                    {analytics.applied}
                  </strong>

                </div>

                <div className="funnel-progress">

                  <div
                    className="funnel-fill applied-fill"
                    style={{
                      width: `${appliedPercentage}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {appliedPercentage}% of total applications
                </small>

              </div>

            </div>

            {/* CONNECTOR */}

            <div className="funnel-connector">
              ↓
              <span>
                {shortlistedPercentage}% conversion
              </span>
            </div>

            {/* SHORTLISTED */}

            <div className="funnel-step">

              <div className="funnel-icon shortlisted-icon">
                2
              </div>

              <div className="funnel-content">

                <div className="funnel-top">

                  <div>

                    <h3>
                      Shortlisted
                    </h3>

                    <p>
                      Candidates shortlisted
                    </p>

                  </div>

                  <strong>
                    {analytics.shortlisted}
                  </strong>

                </div>

                <div className="funnel-progress">

                  <div
                    className="funnel-fill shortlisted-fill"
                    style={{
                      width: `${getPercentage(
                        analytics.shortlisted,
                        analytics.totalApplications
                      )}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {shortlistedPercentage}% of applied candidates
                </small>

              </div>

            </div>

            {/* CONNECTOR */}

            <div className="funnel-connector">

              ↓

              <span>
                {interviewPercentage}% conversion
              </span>

            </div>

            {/* INTERVIEW */}

            <div className="funnel-step">

              <div className="funnel-icon interview-icon">
                3
              </div>

              <div className="funnel-content">

                <div className="funnel-top">

                  <div>

                    <h3>
                      Interview
                    </h3>

                    <p>
                      Candidates invited for interview
                    </p>

                  </div>

                  <strong>
                    {analytics.interview}
                  </strong>

                </div>

                <div className="funnel-progress">

                  <div
                    className="funnel-fill interview-fill"
                    style={{
                      width:
                        `${getPercentage(
                          analytics.interview,
                          analytics.totalApplications
                        )}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {interviewPercentage}% of shortlisted candidates
                </small>

              </div>

            </div>

            {/* CONNECTOR */}

            <div className="funnel-connector">

              ↓

              <span>
                {selectedPercentage}% conversion
              </span>

            </div>

            {/* SELECTED */}

            <div className="funnel-step">

              <div className="funnel-icon selected-icon">
                4
              </div>

              <div className="funnel-content">

                <div className="funnel-top">

                  <div>

                    <h3>
                      Selected
                    </h3>

                    <p>
                      Candidates selected
                    </p>

                  </div>

                  <strong>
                    {analytics.selected}
                  </strong>

                </div>

                <div className="funnel-progress">

                  <div
                    className="funnel-fill selected-fill"
                    style={{
                      width:
                        `${getPercentage(
                          analytics.selected,
                          analytics.totalApplications
                        )}%`,
                    }}
                  ></div>

                </div>

                <small>
                  {overallSelectionRate}% of total applications
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================
            CONVERSION SUMMARY
        ======================================== */}

        <section className="conversion-section">

          <div className="conversion-card">

            <div className="conversion-icon">
              📈
            </div>

            <div className="conversion-content">

              <p>
                Overall Selection Rate
              </p>

              <h2>
                {overallSelectionRate}%
              </h2>

              <span>
                {analytics.selected} selected out of{" "}
                {analytics.totalApplications} total applications
              </span>

            </div>

          </div>

          <div className="conversion-card">

            <div className="conversion-icon">
              🎯
            </div>

            <div className="conversion-content">

              <p>
                Interview Success Rate
              </p>

              <h2>
                {selectedPercentage}%
              </h2>

              <span>
                {analytics.selected} selected out of{" "}
                {analytics.interview} interviewed
              </span>

            </div>

          </div>

          <div className="conversion-card">

            <div className="conversion-icon">
              ⭐
            </div>

            <div className="conversion-content">

              <p>
                Shortlist Rate
              </p>

              <h2>
                {shortlistedPercentage}%
              </h2>

              <span>
                {analytics.shortlisted} shortlisted out of{" "}
                {analytics.applied} applicants
              </span>

            </div>

          </div>

        </section>

      </main>

      {/* ========================================
          STYLES
      ======================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* ========================================
           PAGE
        ======================================== */

        .job-analytics-page {
          min-height: 100vh;

          background: #f8fafc;

          color: #0f172a;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        /* ========================================
           NAVBAR
        ======================================== */

        .analytics-navbar {
          height: 72px;

          padding: 0 7%;

          background: white;

          border-bottom:
            1px solid #e2e8f0;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .analytics-logo {
          text-decoration: none;

          color: #2563eb;

          font-size: 24px;

          font-weight: 800;
        }

        .dashboard-btn {
          text-decoration: none;

          padding: 10px 16px;

          border-radius: 8px;

          background: #2563eb;

          color: white;

          font-size: 14px;

          font-weight: 700;
        }

        .dashboard-btn:hover {
          background: #1d4ed8;
        }

        /* ========================================
           CONTAINER
        ======================================== */

        .analytics-container {
          width: 90%;

          max-width: 1200px;

          margin: auto;

          padding: 40px 0 70px;
        }

        /* ========================================
           HEADER
        ======================================== */

        .analytics-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 30px;
        }

        .page-label {
          margin: 0 0 8px;

          color: #2563eb;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 0.1em;
        }

        .analytics-header h1 {
          margin: 0 0 8px;

          font-size: 32px;

          line-height: 1.2;
        }

        .company {
          margin: 0;

          color: #64748b;

          font-size: 15px;
        }

        .analytics-header-actions {
          display: flex;

          align-items: center;

          gap: 10px;

          flex-wrap: wrap;
        }

        .view-applicants-btn {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 10px 16px;

          border-radius: 8px;

          background: #2563eb;

          color: white;

          text-decoration: none;

          font-size: 14px;

          font-weight: 700;

          transition: 0.2s;
        }

        .view-applicants-btn:hover {
          background: #1d4ed8;
        }

        .refresh-btn {
          border:
            1px solid #cbd5e1;

          background: white;

          padding: 10px 16px;

          border-radius: 8px;

          cursor: pointer;

          color: #475569;

          font-weight: 700;

          transition: 0.2s;
        }

        .refresh-btn:hover {
          background: #f1f5f9;

          border-color: #94a3b8;
        }

        /* ========================================
           JOB DETAILS
        ======================================== */

        .job-details-card {
          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 15px;

          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 14px;

          padding: 20px;

          margin-bottom: 25px;
        }

        .job-detail {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .job-detail span {
          font-size: 12px;

          color: #64748b;
        }

        .job-detail strong {
          font-size: 14px;

          color: #0f172a;
        }

        .active-status {
          color: #047857 !important;
        }

        .closed-status {
          color: #dc2626 !important;
        }

        /* ========================================
           TOTAL CARD
        ======================================== */

        .total-card {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 28px;

          border-radius: 16px;

          background: white;

          border:
            1px solid #bfdbfe;

          margin-bottom: 35px;

          box-shadow:
            0 4px 15px
            rgba(37, 99, 235, 0.05);
        }

        .total-card p {
          margin: 0 0 5px;

          color: #64748b;

          font-size: 14px;

          font-weight: 600;
        }

        .total-card h2 {
          margin: 0 0 4px;

          color: #2563eb;

          font-size: 40px;
        }

        .total-description {
          color: #94a3b8;

          font-size: 12px;
        }

        .total-icon {
          width: 65px;

          height: 65px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background: #eff6ff;

          font-size: 32px;
        }

        /* ========================================
           BREAKDOWN
        ======================================== */

        .breakdown-header {
          margin-bottom: 20px;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .breakdown-header h2 {
          margin: 0 0 5px;

          font-size: 24px;
        }

        .breakdown-header p {
          margin: 0;

          color: #64748b;

          font-size: 14px;
        }

        /* ========================================
           STATUS GRID
        ======================================== */

        .status-grid {
          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          gap: 15px;
        }

        .status-card {
          padding: 22px;

          border-radius: 14px;

          border:
            1px solid #e2e8f0;

          background: white;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .status-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 8px 20px
            rgba(15, 23, 42, 0.08);
        }

        .status-card-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;
        }

        .status-card-top p {
          margin: 0;

          color: #64748b;

          font-size: 13px;

          font-weight: 600;
        }

        .status-card-top span {
          font-size: 13px;

          font-weight: 800;

          color: #475569;
        }

        .status-card h2 {
          margin: 12px 0 15px;

          font-size: 30px;
        }

        .progress-track {
          width: 100%;

          height: 8px;

          background: #e2e8f0;

          border-radius: 999px;

          overflow: hidden;
        }

        .progress-fill {
          height: 100%;

          border-radius: 999px;

          background: currentColor;

          transition:
            width 0.5s ease;
        }

        .status-card.applied
          .progress-fill {
          color: #2563eb;
        }

        .status-card.shortlisted
          .progress-fill {
          color: #b45309;
        }

        .status-card.interview
          .progress-fill {
          color: #6d28d9;
        }

        .status-card.selected
          .progress-fill {
          color: #047857;
        }

        .status-card.rejected
          .progress-fill {
          color: #dc2626;
        }

        .status-card small {
          display: block;

          margin-top: 10px;

          color: #64748b;

          font-size: 12px;
        }

        .applied {
          background: #eff6ff;

          border-color: #bfdbfe;
        }

        .applied h2 {
          color: #2563eb;
        }

        .shortlisted {
          background: #fffbeb;

          border-color: #fde68a;
        }

        .shortlisted h2 {
          color: #b45309;
        }

        .interview {
          background: #f5f3ff;

          border-color: #ddd6fe;
        }

        .interview h2 {
          color: #6d28d9;
        }

        .selected {
          background: #ecfdf5;

          border-color: #a7f3d0;
        }

        .selected h2 {
          color: #047857;
        }

        .rejected {
          background: #fef2f2;

          border-color: #fecaca;
        }

        .rejected h2 {
          color: #dc2626;
        }

        /* ========================================
           FUNNEL
        ======================================== */

        .funnel-section {
          margin-top: 45px;
        }

        .funnel-card {
          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 16px;

          padding: 28px;

          box-shadow:
            0 4px 15px
            rgba(15, 23, 42, 0.04);
        }

        .funnel-step {
          display: flex;

          align-items: center;

          gap: 18px;
        }

        .funnel-icon {
          width: 48px;

          height: 48px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          font-weight: 800;

          font-size: 17px;
        }

        .applied-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .shortlisted-icon {
          background: #fef3c7;
          color: #b45309;
        }

        .interview-icon {
          background: #ede9fe;
          color: #6d28d9;
        }

        .selected-icon {
          background: #d1fae5;
          color: #047857;
        }

        .funnel-content {
          flex: 1;
        }

        .funnel-top {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;
        }

        .funnel-top h3 {
          margin: 0 0 3px;

          font-size: 16px;
        }

        .funnel-top p {
          margin: 0;

          color: #64748b;

          font-size: 12px;
        }

        .funnel-top strong {
          font-size: 22px;
        }

        .funnel-progress {
          width: 100%;

          height: 10px;

          margin-top: 12px;

          background: #e2e8f0;

          border-radius: 999px;

          overflow: hidden;
        }

        .funnel-fill {
          height: 100%;

          border-radius: 999px;

          transition:
            width 0.5s ease;
        }

        .applied-fill {
          background: #2563eb;
        }

        .shortlisted-fill {
          background: #b45309;
        }

        .interview-fill {
          background: #6d28d9;
        }

        .selected-fill {
          background: #047857;
        }

        .funnel-content small {
          display: block;

          margin-top: 7px;

          color: #64748b;

          font-size: 11px;
        }

        .funnel-connector {
          margin: 8px 0 8px 22px;

          color: #94a3b8;

          font-size: 22px;

          font-weight: 700;

          display: flex;

          align-items: center;

          gap: 10px;
        }

        .funnel-connector span {
          font-size: 12px;

          color: #64748b;

          font-weight: 600;
        }

        /* ========================================
           CONVERSION SUMMARY
        ======================================== */

        .conversion-section {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;

          margin-top: 25px;
        }

        .conversion-card {
          display: flex;

          align-items: center;

          gap: 15px;

          padding: 22px;

          background: white;

          border:
            1px solid #e2e8f0;

          border-radius: 14px;
        }

        .conversion-icon {
          width: 50px;

          height: 50px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          background: #eff6ff;

          font-size: 24px;
        }

        .conversion-content p {
          margin: 0 0 3px;

          color: #64748b;

          font-size: 12px;

          font-weight: 600;
        }

        .conversion-content h2 {
          margin: 0 0 3px;

          color: #2563eb;

          font-size: 27px;
        }

        .conversion-content span {
          color: #94a3b8;

          font-size: 11px;

          line-height: 1.4;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 1000px) {

          .job-details-card {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .status-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .conversion-section {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        @media (max-width: 700px) {

          .analytics-navbar {
            padding: 0 5%;
          }

          .analytics-container {
            width: 94%;

            padding-top: 25px;
          }

          .analytics-header {
            flex-direction: column;

            align-items: flex-start;
          }

          .analytics-header-actions {
            width: 100%;

            flex-direction: column;

            align-items: stretch;
          }

          .view-applicants-btn,
          .refresh-btn {
            width: 100%;

            text-align: center;
          }

          .job-details-card {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .status-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .conversion-section {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 480px) {

          .analytics-navbar {
            height: 65px;
          }

          .analytics-logo {
            font-size: 20px;
          }

          .dashboard-btn {
            padding: 8px 11px;

            font-size: 12px;
          }

          .analytics-header h1 {
            font-size: 25px;
          }

          .job-details-card {
            grid-template-columns: 1fr;
          }

          .status-grid {
            grid-template-columns: 1fr;
          }

          .total-card {
            padding: 22px;
          }

          .total-card h2 {
            font-size: 34px;
          }

          .total-icon {
            width: 55px;

            height: 55px;

            font-size: 26px;
          }

          .funnel-card {
            padding: 20px 15px;
          }

          .funnel-step {
            gap: 12px;
          }

          .funnel-icon {
            width: 40px;

            height: 40px;

            font-size: 14px;
          }

          .funnel-connector {
            margin-left: 18px;

            font-size: 18px;
          }

        }

      `}</style>

    </div>
  );
};

export default JobAnalytics;

