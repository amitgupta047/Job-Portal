import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/recruiter/analytics");

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      } else {
        setError("Failed to load analytics.");
      }
    } catch (error) {
      console.error("RECRUITER ANALYTICS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load recruiter analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // PERCENTAGE HELPER
  // =====================================================

  const getPercentage = (value, total) => {
    if (!total || total <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Number(((value / total) * 100).toFixed(1))
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
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

          .analytics-loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f5f7fb;
          }

          .analytics-loader {
            width: 46px;
            height: 46px;

            border: 4px solid #e5e7eb;
            border-top: 4px solid #2563eb;

            border-radius: 50%;

            animation: analyticsSpin 0.8s linear infinite;

            margin-bottom: 18px;
          }

          @keyframes analyticsSpin {
            to {
              transform: rotate(360deg);
            }
          }

          .analytics-loading-page h2 {
            margin: 0;
            color: #374151;
          }
        `}</style>

        <div className="analytics-loading-page">
          <div className="analytics-loader"></div>

          <h2>Loading Analytics...</h2>
        </div>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
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

          .analytics-error-page {
            min-height: 100vh;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;

            background: #f5f7fb;
          }

          .analytics-error-box {
            width: 100%;
            max-width: 500px;

            padding: 35px;

            background: white;

            border-radius: 12px;

            text-align: center;

            box-shadow:
              0 5px 20px rgba(0, 0, 0, 0.08);
          }

          .analytics-error-box h2 {
            margin-top: 0;
            color: #111827;
          }

          .analytics-error-message {
            padding: 12px 15px;

            margin: 18px 0 22px;

            border-radius: 7px;

            background: #fee2e2;

            border: 1px solid #fecaca;

            color: #b91c1c;

            font-size: 14px;
          }

          .analytics-retry-btn {
            border: none;

            padding: 11px 20px;

            border-radius: 7px;

            background: #2563eb;

            color: white;

            font-weight: 600;

            cursor: pointer;
          }

          .analytics-retry-btn:hover {
            background: #1d4ed8;
          }
        `}</style>

        <div className="analytics-error-page">

          <div className="analytics-error-box">

            <h2>
              Analytics Unavailable
            </h2>

            <div className="analytics-error-message">
              {error}
            </div>

            <button
              type="button"
              className="analytics-retry-btn"
              onClick={fetchAnalytics}
            >
              Try Again
            </button>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // SAFE DATA
  // =====================================================

  const totalJobs = analytics?.totalJobs || 0;

  const totalApplications =
    analytics?.totalApplications || 0;

  const applied = analytics?.applied || 0;

  const shortlisted =
    analytics?.shortlisted || 0;

  const interview =
    analytics?.interview || 0;

  const selected =
    analytics?.selected || 0;

  const rejected =
    analytics?.rejected || 0;

  const selectionRate =
    analytics?.selectionRate || 0;

  const rejectionRate =
    analytics?.rejectionRate || 0;

  const jobWise =
    analytics?.jobWise || [];

  // =====================================================
  // STATUS PERCENTAGES
  // =====================================================

  const appliedPercentage =
    getPercentage(
      applied,
      totalApplications
    );

  const shortlistedPercentage =
    getPercentage(
      shortlisted,
      totalApplications
    );

  const interviewPercentage =
    getPercentage(
      interview,
      totalApplications
    );

  const selectedPercentage =
    getPercentage(
      selected,
      totalApplications
    );

  const rejectedPercentage =
    getPercentage(
      rejected,
      totalApplications
    );

  // =====================================================
  // FUNNEL CONVERSION
  // =====================================================

  const shortlistConversion =
    getPercentage(
      shortlisted,
      applied
    );

  const interviewConversion =
    getPercentage(
      interview,
      shortlisted
    );

  const selectionConversion =
    getPercentage(
      selected,
      interview
    );

  // =====================================================
  // MAX APPLICATIONS FOR JOB CHART
  // =====================================================

  const maxJobApplications =
    jobWise.length > 0
      ? Math.max(
          ...jobWise.map(
            (job) =>
              job.totalApplications || 0
          ),
          1
        )
      : 1;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background: #f5f7fb;

          color: #111827;
        }

        /* =================================================
           PAGE
        ================================================= */

        .recruiter-analytics-page {
          min-height: 100vh;

          background: #f5f7fb;

          padding-bottom: 60px;
        }

        /* =================================================
           NAVBAR
        ================================================= */

        .analytics-navbar {
          min-height: 70px;

          background: white;

          border-bottom:
            1px solid #e5e7eb;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 0 7%;
        }

        .analytics-navbar h2 {
          margin: 0;

          color: #2563eb;

          font-size: 24px;
        }

        .analytics-nav-actions {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .analytics-refresh-btn {
          border:
            1px solid #d1d5db;

          background: white;

          color: #374151;

          padding: 10px 16px;

          border-radius: 7px;

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;
        }

        .analytics-refresh-btn:hover {
          background: #f3f4f6;
        }

        .analytics-dashboard-btn {
          text-decoration: none;

          background: #2563eb;

          color: white;

          padding: 10px 17px;

          border-radius: 7px;

          font-size: 14px;

          font-weight: 600;
        }

        .analytics-dashboard-btn:hover {
          background: #1d4ed8;
        }

        /* =================================================
           CONTAINER
        ================================================= */

        .analytics-container {
          width: 90%;

          max-width: 1250px;

          margin: 35px auto;
        }

        .analytics-header {
          margin-bottom: 28px;
        }

        .analytics-header h1 {
          margin: 0 0 8px;

          font-size: 32px;

          color: #111827;
        }

        .analytics-header p {
          margin: 0;

          color: #6b7280;

          font-size: 15px;
        }

        /* =================================================
           KPI CARDS
        ================================================= */

        .kpi-grid {
          display: grid;

          grid-template-columns:
            repeat(6, minmax(0, 1fr));

          gap: 15px;

          margin-bottom: 25px;
        }

        .kpi-card {
          background: white;

          border:
            1px solid #e5e7eb;

          border-radius: 12px;

          padding: 19px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.05);
        }

        .kpi-card-title {
          color: #6b7280;

          font-size: 12px;

          font-weight: 600;

          margin-bottom: 9px;
        }

        .kpi-card-value {
          color: #111827;

          font-size: 27px;

          font-weight: 700;
        }

        /* =================================================
           CHART GRID
        ================================================= */

        .chart-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 20px;

          margin-bottom: 25px;
        }

        .chart-card {
          background: white;

          border:
            1px solid #e5e7eb;

          border-radius: 12px;

          padding: 25px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.05);
        }

        .chart-card-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 25px;
        }

        .chart-card-header h2 {
          margin: 0;

          font-size: 19px;

          color: #111827;
        }

        .chart-card-header span {
          color: #9ca3af;

          font-size: 12px;
        }

        /* =================================================
           STATUS BAR CHART
        ================================================= */

        .status-chart {
          display: flex;

          flex-direction: column;

          gap: 18px;
        }

        .status-chart-row {
          display: grid;

          grid-template-columns:
            95px 1fr 50px;

          align-items: center;

          gap: 12px;
        }

        .status-chart-label {
          color: #374151;

          font-size: 13px;

          font-weight: 600;
        }

        .status-chart-track {
          width: 100%;

          height: 14px;

          background: #eef2f7;

          border-radius: 20px;

          overflow: hidden;
        }

        .status-chart-bar {
          height: 100%;

          background: #2563eb;

          border-radius: 20px;

          transition:
            width 0.5s ease;
        }

        .status-chart-value {
          text-align: right;

          color: #111827;

          font-size: 13px;

          font-weight: 700;
        }

        /* =================================================
           FUNNEL
        ================================================= */

        .funnel-container {
          display: flex;

          flex-direction: column;

          gap: 15px;
        }

        .funnel-row {
          display: grid;

          grid-template-columns:
            110px 1fr 65px;

          align-items: center;

          gap: 12px;
        }

        .funnel-label {
          font-size: 13px;

          font-weight: 600;

          color: #374151;
        }

        .funnel-track {
          height: 18px;

          background: #eef2f7;

          border-radius: 20px;

          overflow: hidden;
        }

        .funnel-bar {
          height: 100%;

          background: #2563eb;

          border-radius: 20px;

          transition:
            width 0.5s ease;
        }

        .funnel-value {
          text-align: right;

          font-size: 13px;

          font-weight: 700;

          color: #111827;
        }

        .funnel-conversion {
          margin-top: 3px;

          margin-left: 122px;

          color: #9ca3af;

          font-size: 11px;
        }

        /* =================================================
           RATE SECTION
        ================================================= */

        .rates-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 15px;

          margin-bottom: 25px;
        }

        .rate-box {
          background: white;

          border:
            1px solid #e5e7eb;

          border-radius: 12px;

          padding: 22px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.05);
        }

        .rate-box-label {
          color: #6b7280;

          font-size: 13px;

          margin-bottom: 8px;
        }

        .rate-box-value {
          font-size: 31px;

          font-weight: 700;

          color: #111827;

          margin-bottom: 8px;
        }

        .rate-box-description {
          color: #9ca3af;

          font-size: 12px;
        }

        /* =================================================
           JOB APPLICATION CHART
        ================================================= */

        .job-chart-card {
          background: white;

          border:
            1px solid #e5e7eb;

          border-radius: 12px;

          padding: 25px;

          margin-bottom: 25px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.05);
        }

        .job-chart-row {
          margin-bottom: 20px;
        }

        .job-chart-row:last-child {
          margin-bottom: 0;
        }

        .job-chart-info {
          display: flex;

          justify-content: space-between;

          gap: 15px;

          margin-bottom: 7px;
        }

        .job-chart-name {
          color: #374151;

          font-size: 13px;

          font-weight: 600;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .job-chart-count {
          color: #111827;

          font-size: 13px;

          font-weight: 700;
        }

        .job-chart-track {
          width: 100%;

          height: 12px;

          background: #eef2f7;

          border-radius: 20px;

          overflow: hidden;
        }

        .job-chart-bar {
          height: 100%;

          background: #2563eb;

          border-radius: 20px;

          transition:
            width 0.5s ease;
        }

        /* =================================================
           PERFORMANCE TABLE
        ================================================= */

        .performance-card {
          background: white;

          border:
            1px solid #e5e7eb;

          border-radius: 12px;

          padding: 25px;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.05);
        }

        .performance-header {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 20px;
        }

        .performance-header h2 {
          margin: 0;

          font-size: 20px;
        }

        .performance-header span {
          color: #6b7280;

          font-size: 13px;
        }

        .table-wrapper {
          width: 100%;

          overflow-x: auto;
        }

        .analytics-table {
          width: 100%;

          min-width: 950px;

          border-collapse: collapse;
        }

        .analytics-table th {
          padding: 13px 12px;

          background: #f9fafb;

          border-bottom:
            1px solid #e5e7eb;

          color: #6b7280;

          text-align: left;

          font-size: 11px;

          text-transform: uppercase;
        }

        .analytics-table td {
          padding: 15px 12px;

          border-bottom:
            1px solid #f0f0f0;

          color: #374151;

          font-size: 13px;
        }

        .analytics-table tr:last-child td {
          border-bottom: none;
        }

        .job-name {
          color: #111827;

          font-weight: 600;
        }

        .job-company {
          margin-top: 4px;

          color: #9ca3af;

          font-size: 11px;
        }

        .status-badge {
          display: inline-block;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 10px;

          font-weight: 700;
        }

        .status-active {
          background: #dcfce7;

          color: #15803d;
        }

        .status-closed {
          background: #fee2e2;

          color: #b91c1c;
        }

        .selection-rate {
          color: #15803d;

          font-weight: 700;
        }

        .view-analytics-btn {
          display: inline-block;

          padding: 8px 12px;

          border-radius: 6px;

          background: #eff6ff;

          color: #2563eb;

          text-decoration: none;

          font-size: 11px;

          font-weight: 600;
        }

        .view-analytics-btn:hover {
          background: #dbeafe;
        }

        /* =================================================
           EMPTY STATE
        ================================================= */

        .empty-state {
          text-align: center;

          padding: 50px 20px;

          color: #6b7280;
        }

        .empty-icon {
          font-size: 45px;

          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 0 0 7px;

          color: #374151;
        }

        .empty-state p {
          margin: 0;

          font-size: 13px;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1100px) {
          .kpi-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }
        }

        @media (max-width: 850px) {
          .chart-grid {
            grid-template-columns: 1fr;
          }

          .rates-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .analytics-navbar {
            padding: 15px 20px;

            flex-direction: column;

            gap: 12px;
          }

          .analytics-navbar h2 {
            font-size: 20px;
          }

          .analytics-nav-actions {
            width: 100%;

            justify-content: center;
          }

          .analytics-refresh-btn,
          .analytics-dashboard-btn {
            flex: 1;

            text-align: center;
          }

          .analytics-container {
            width: 94%;

            margin-top: 25px;
          }

          .analytics-header h1 {
            font-size: 27px;
          }

          .kpi-grid {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 12px;
          }

          .kpi-card {
            padding: 16px;
          }

          .kpi-card-value {
            font-size: 24px;
          }

          .chart-card,
          .job-chart-card,
          .performance-card {
            padding: 18px;
          }

          .status-chart-row {
            grid-template-columns:
              75px 1fr 40px;

            gap: 8px;
          }

          .funnel-row {
            grid-template-columns:
              80px 1fr 45px;

            gap: 8px;
          }

          .funnel-conversion {
            margin-left: 88px;
          }
        }
      `}</style>

      <div className="recruiter-analytics-page">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <nav className="analytics-navbar">

          <h2>
            Job Portal - Recruiter
          </h2>

          <div className="analytics-nav-actions">

            <button
              type="button"
              className="analytics-refresh-btn"
              onClick={fetchAnalytics}
            >
              ↻ Refresh
            </button>

            <Link
              to="/recruiter-dashboard"
              className="analytics-dashboard-btn"
            >
              Dashboard
            </Link>

          </div>

        </nav>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="analytics-container">

          {/* HEADER */}

          <div className="analytics-header">

            <h1>
              Recruiter Analytics
            </h1>

            <p>
              Monitor your recruitment performance
              and hiring pipeline.
            </p>

          </div>

          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div className="kpi-grid">

            <div className="kpi-card">
              <div className="kpi-card-title">
                Total Jobs
              </div>

              <div className="kpi-card-value">
                {totalJobs}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">
                Applications
              </div>

              <div className="kpi-card-value">
                {totalApplications}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">
                Applied
              </div>

              <div className="kpi-card-value">
                {applied}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">
                Shortlisted
              </div>

              <div className="kpi-card-value">
                {shortlisted}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">
                Interviews
              </div>

              <div className="kpi-card-value">
                {interview}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">
                Selected
              </div>

              <div className="kpi-card-value">
                {selected}
              </div>
            </div>

          </div>

          {/* =================================================
              CHARTS
          ================================================= */}

          <div className="chart-grid">

            {/* STATUS DISTRIBUTION */}

            <section className="chart-card">

              <div className="chart-card-header">

                <h2>
                  Application Distribution
                </h2>

                <span>
                  {totalApplications} total
                </span>

              </div>

              <div className="status-chart">

                {/* APPLIED */}

                <div className="status-chart-row">

                  <span className="status-chart-label">
                    Applied
                  </span>

                  <div className="status-chart-track">

                    <div
                      className="status-chart-bar"
                      style={{
                        width:
                          `${appliedPercentage}%`,
                      }}
                    ></div>

                  </div>

                  <span className="status-chart-value">
                    {applied}
                  </span>

                </div>

                {/* SHORTLISTED */}

                <div className="status-chart-row">

                  <span className="status-chart-label">
                    Shortlisted
                  </span>

                  <div className="status-chart-track">

                    <div
                      className="status-chart-bar"
                      style={{
                        width:
                          `${shortlistedPercentage}%`,
                      }}
                    ></div>

                  </div>

                  <span className="status-chart-value">
                    {shortlisted}
                  </span>

                </div>

                {/* INTERVIEW */}

                <div className="status-chart-row">

                  <span className="status-chart-label">
                    Interview
                  </span>

                  <div className="status-chart-track">

                    <div
                      className="status-chart-bar"
                      style={{
                        width:
                          `${interviewPercentage}%`,
                      }}
                    ></div>

                  </div>

                  <span className="status-chart-value">
                    {interview}
                  </span>

                </div>

                {/* SELECTED */}

                <div className="status-chart-row">

                  <span className="status-chart-label">
                    Selected
                  </span>

                  <div className="status-chart-track">

                    <div
                      className="status-chart-bar"
                      style={{
                        width:
                          `${selectedPercentage}%`,
                      }}
                    ></div>

                  </div>

                  <span className="status-chart-value">
                    {selected}
                  </span>

                </div>

                {/* REJECTED */}

                <div className="status-chart-row">

                  <span className="status-chart-label">
                    Rejected
                  </span>

                  <div className="status-chart-track">

                    <div
                      className="status-chart-bar"
                      style={{
                        width:
                          `${rejectedPercentage}%`,
                      }}
                    ></div>

                  </div>

                  <span className="status-chart-value">
                    {rejected}
                  </span>

                </div>

              </div>

            </section>

            {/* HIRING FUNNEL */}

            <section className="chart-card">

              <div className="chart-card-header">

                <h2>
                  Hiring Funnel
                </h2>

                <span>
                  Conversion
                </span>

              </div>

              <div className="funnel-container">

                {/* APPLIED */}

                <div>

                  <div className="funnel-row">

                    <span className="funnel-label">
                      Applied
                    </span>

                    <div className="funnel-track">

                      <div
                        className="funnel-bar"
                        style={{
                          width:
                            `${appliedPercentage}%`,
                        }}
                      ></div>

                    </div>

                    <span className="funnel-value">
                      {applied}
                    </span>

                  </div>

                </div>

                {/* SHORTLISTED */}

                <div>

                  <div className="funnel-row">

                    <span className="funnel-label">
                      Shortlisted
                    </span>

                    <div className="funnel-track">

                      <div
                        className="funnel-bar"
                        style={{
                          width:
                            `${shortlistedPercentage}%`,
                        }}
                      ></div>

                    </div>

                    <span className="funnel-value">
                      {shortlisted}
                    </span>

                  </div>

                  <div className="funnel-conversion">
                    {shortlistConversion}% from Applied
                  </div>

                </div>

                {/* INTERVIEW */}

                <div>

                  <div className="funnel-row">

                    <span className="funnel-label">
                      Interview
                    </span>

                    <div className="funnel-track">

                      <div
                        className="funnel-bar"
                        style={{
                          width:
                            `${interviewPercentage}%`,
                        }}
                      ></div>

                    </div>

                    <span className="funnel-value">
                      {interview}
                    </span>

                  </div>

                  <div className="funnel-conversion">
                    {interviewConversion}% from Shortlisted
                  </div>

                </div>

                {/* SELECTED */}

                <div>

                  <div className="funnel-row">

                    <span className="funnel-label">
                      Selected
                    </span>

                    <div className="funnel-track">

                      <div
                        className="funnel-bar"
                        style={{
                          width:
                            `${selectedPercentage}%`,
                        }}
                      ></div>

                    </div>

                    <span className="funnel-value">
                      {selected}
                    </span>

                  </div>

                  <div className="funnel-conversion">
                    {selectionConversion}% from Interview
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RATE CARDS
          ================================================= */}

          <div className="rates-grid">

            <div className="rate-box">

              <div className="rate-box-label">
                Overall Selection Rate
              </div>

              <div className="rate-box-value">
                {selectionRate}%
              </div>

              <div className="rate-box-description">
                Percentage of total applications
                resulting in selection.
              </div>

            </div>

            <div className="rate-box">

              <div className="rate-box-label">
                Overall Rejection Rate
              </div>

              <div className="rate-box-value">
                {rejectionRate}%
              </div>

              <div className="rate-box-description">
                Percentage of total applications
                marked as rejected.
              </div>

            </div>

          </div>

          {/* =================================================
              JOB APPLICATION CHART
          ================================================= */}

          <section className="job-chart-card">

            <div className="chart-card-header">

              <h2>
                Applications by Job
              </h2>

              <span>
                Top performing jobs
              </span>

            </div>

            {jobWise.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📊
                </div>

                <h3>
                  No Job Data
                </h3>

                <p>
                  Applications will appear here
                  once candidates apply.
                </p>

              </div>

            ) : (

              jobWise
                .slice(0, 8)
                .map((job) => {

                  const percentage =
                    getPercentage(
                      job.totalApplications || 0,
                      maxJobApplications
                    );

                  return (
                    <div
                      className="job-chart-row"
                      key={job._id}
                    >

                      <div className="job-chart-info">

                        <span className="job-chart-name">
                          {job.title}
                        </span>

                        <span className="job-chart-count">
                          {job.totalApplications || 0}
                        </span>

                      </div>

                      <div className="job-chart-track">

                        <div
                          className="job-chart-bar"
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        ></div>

                      </div>

                    </div>
                  );
                })

            )}

          </section>

          {/* =================================================
              JOB PERFORMANCE TABLE
          ================================================= */}

          <section className="performance-card">

            <div className="performance-header">

              <h2>
                Job Performance
              </h2>

              <span>
                {jobWise.length} jobs
              </span>

            </div>

            {jobWise.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  💼
                </div>

                <h3>
                  No Jobs Available
                </h3>

                <p>
                  Create a job to start tracking
                  recruiter performance.
                </p>

              </div>

            ) : (

              <div className="table-wrapper">

                <table className="analytics-table">

                  <thead>

                    <tr>

                      <th>
                        Job
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Applications
                      </th>

                      <th>
                        Applied
                      </th>

                      <th>
                        Shortlisted
                      </th>

                      <th>
                        Interview
                      </th>

                      <th>
                        Selected
                      </th>

                      <th>
                        Rejected
                      </th>

                      <th>
                        Selection Rate
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {jobWise.map((job) => (

                      <tr key={job._id}>

                        <td>

                          <div className="job-name">
                            {job.title}
                          </div>

                          <div className="job-company">
                            {job.company}
                          </div>

                        </td>

                        <td>

                          <span
                            className={
                              job.status === "Closed"
                                ? "status-badge status-closed"
                                : "status-badge status-active"
                            }
                          >
                            {job.status || "Active"}
                          </span>

                        </td>

                        <td>
                          <strong>
                            {job.totalApplications || 0}
                          </strong>
                        </td>

                        <td>
                          {job.applied || 0}
                        </td>

                        <td>
                          {job.shortlisted || 0}
                        </td>

                        <td>
                          {job.interview || 0}
                        </td>

                        <td>
                          {job.selected || 0}
                        </td>

                        <td>
                          {job.rejected || 0}
                        </td>

                        <td>

                          <span className="selection-rate">
                            {job.selectionRate || 0}%
                          </span>

                        </td>

                        <td>

                          <Link
                            to={`/job-analytics/${job._id}`}
                            className="view-analytics-btn"
                          >
                            View
                          </Link>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </main>

      </div>
    </>
  );
};

export default RecruiterAnalytics;
