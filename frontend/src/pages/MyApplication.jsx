
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const MyApplications = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/my-applications");

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("FETCH APPLICATIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status applied";

      case "Shortlisted":
        return "status shortlisted";

      case "Interview":
        return "status interview";

      case "Selected":
        return "status selected";

      case "Rejected":
        return "status rejected";

      default:
        return "status";
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          .loading-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f7fb;
            font-family: Arial, sans-serif;
          }

          .loading-box {
            background: white;
            padding: 35px 45px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            text-align: center;
            color: #374151;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            margin: 0 auto 18px;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="loading-page">
          <div className="loading-box">
            <div className="spinner"></div>
            <h2>Loading applications...</h2>
            <p>Please wait while we fetch your applications.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="applications-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        .applications-page {
          min-height: 100vh;
          background: #f5f7fb;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
          color: #1f2937;
        }

        /* ================= NAVBAR ================= */

        .applications-navbar {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .brand h2 {
          margin: 0;
          font-size: 21px;
          color: #111827;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .welcome-text {
          color: #4b5563;
          font-size: 14px;
        }

        .welcome-text strong {
          color: #111827;
        }

        .back-btn {
          text-decoration: none;
          background: #eff6ff;
          color: #2563eb;
          padding: 10px 17px;
          border-radius: 9px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: #2563eb;
          color: white;
          transform: translateY(-1px);
        }

        /* ================= MAIN ================= */

        .applications-main {
          width: 86%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 45px 0 70px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-header h1 {
          margin: 0 0 8px;
          font-size: 32px;
          color: #111827;
          letter-spacing: -0.5px;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        /* ================= ERROR ================= */

        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 15px 18px;
          border-radius: 10px;
          margin-bottom: 25px;
          font-size: 14px;
        }

        /* ================= EMPTY STATE ================= */

        .empty-state {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 70px 25px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
        }

        .empty-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .empty-state h3 {
          margin: 0 0 10px;
          font-size: 22px;
          color: #111827;
        }

        .empty-state p {
          color: #6b7280;
          margin: 0 0 25px;
        }

        .browse-btn {
          display: inline-block;
          text-decoration: none;
          background: #2563eb;
          color: white;
          padding: 12px 22px;
          border-radius: 9px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .browse-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.25);
        }

        /* ================= APPLICATION GRID ================= */

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        /* ================= APPLICATION CARD ================= */

        .application-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .application-card:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 22px;
        }

        .job-title {
          margin: 0 0 7px;
          font-size: 21px;
          color: #111827;
          line-height: 1.3;
        }

        .company-name {
          margin: 0;
          color: #2563eb;
          font-weight: 600;
          font-size: 14px;
        }

        /* ================= STATUS ================= */

        .status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .status.applied {
          background: #eff6ff;
          color: #2563eb;
        }

        .status.shortlisted {
          background: #fef3c7;
          color: #92400e;
        }

        .status.interview {
          background: #f3e8ff;
          color: #7e22ce;
        }

        .status.selected {
          background: #dcfce7;
          color: #15803d;
        }

        .status.rejected {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ================= JOB INFO ================= */

        .job-info {
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          padding: 17px 0;
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .info-value {
          color: #374151;
          font-size: 14px;
          font-weight: 600;
        }

        .applied-date {
          background: #f9fafb;
          padding: 11px 13px;
          border-radius: 9px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #6b7280;
        }

        .applied-date strong {
          color: #374151;
        }

        /* ================= CARD FOOTER ================= */

        .card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .view-job-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          text-decoration: none;
          background: #2563eb;
          color: white;
          padding: 10px 18px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .view-job-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(37, 99, 235, 0.25);
        }

        /* ================= FOCUS ================= */

        .back-btn:focus-visible,
        .browse-btn:focus-visible,
        .view-job-btn:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.3);
          outline-offset: 3px;
        }

        /* ================= TABLET ================= */

        @media (max-width: 850px) {
          .applications-navbar {
            padding: 0 4%;
          }

          .applications-main {
            width: 92%;
          }

          .applications-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 600px) {
          .applications-navbar {
            height: auto;
            min-height: 70px;
            padding: 14px 5%;
            gap: 12px;
          }

          .navbar-right {
            gap: 10px;
          }

          .welcome-text {
            display: none;
          }

          .brand h2 {
            font-size: 18px;
          }

          .brand-icon {
            width: 34px;
            height: 34px;
            font-size: 16px;
          }

          .back-btn {
            padding: 8px 12px;
            font-size: 12px;
          }

          .applications-main {
            width: 92%;
            padding: 30px 0 50px;
          }

          .page-header h1 {
            font-size: 27px;
          }

          .page-header p {
            font-size: 14px;
          }

          .application-card {
            padding: 19px;
          }

          .card-top {
            flex-direction: column;
            gap: 12px;
          }

          .job-title {
            font-size: 19px;
          }

          .job-info {
            grid-template-columns: 1fr;
            gap: 13px;
          }

          .card-footer {
            justify-content: stretch;
          }

          .view-job-btn {
            width: 100%;
          }

          .empty-state {
            padding: 50px 20px;
          }
        }
      `}</style>

      {/* ================= NAVBAR ================= */}

      <nav className="applications-navbar" aria-label="Candidate navigation">
        <div className="brand">
          <div className="brand-icon">J</div>
          <h2>Job Portal</h2>
        </div>

        <div className="navbar-right">
          <span className="welcome-text">
            Welcome, <strong>{user?.name || "Candidate"}</strong>
          </span>

          <Link
            to="/candidate-dashboard"
            className="back-btn"
          >
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="applications-main">

        <div className="page-header">
          <h1>My Applications</h1>
          <p>
            Track and manage all the jobs you have applied for.
          </p>
        </div>

        {error && (
          <div
            className="error-box"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!error && applications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              📄
            </div>

            <h3>No applications found</h3>

            <p>
              You have not applied for any jobs yet.
              Start exploring opportunities today.
            </p>

            <Link
              to="/candidate-dashboard"
              className="browse-btn"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* ================= APPLICATIONS ================= */}

        {applications.length > 0 && (
          <div className="applications-grid">

            {applications.map((application) => {
              const job = application.job;

              return (
                <article
                  className="application-card"
                  key={application._id}
                >

                  {/* CARD HEADER */}

                  <div className="card-top">

                    <div>
                      <h2 className="job-title">
                        {job?.title || "Job not available"}
                      </h2>

                      <p className="company-name">
                        {job?.company || "Company not available"}
                      </p>
                    </div>

                    <span
                      className={getStatusClass(
                        application.status
                      )}
                    >
                      {application.status || "Applied"}
                    </span>

                  </div>

                  {/* JOB INFORMATION */}

                  <div className="job-info">

                    <div className="info-item">
                      <span className="info-label">
                        Location
                      </span>

                      <span className="info-value">
                        📍 {job?.location || "N/A"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">
                        Job Type
                      </span>

                      <span className="info-value">
                        💼 {job?.jobType || "N/A"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">
                        Salary
                      </span>

                      <span className="info-value">
                        💰 {job?.salary || "N/A"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">
                        Experience
                      </span>

                      <span className="info-value">
                        🎯 {job?.experience || "N/A"}
                      </span>
                    </div>

                  </div>

                  {/* APPLICATION DATE */}

                  <div className="applied-date">
                    <strong>Applied On:</strong>{" "}
                    {application.createdAt
                      ? new Date(
                          application.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </div>

                  {/* FOOTER */}

                  {job?._id && (
                    <div className="card-footer">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="view-job-btn"
                      >
                        View Job →
                      </Link>
                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
};

export default MyApplications;

