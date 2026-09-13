
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch job details
  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${id}`);

      console.log("JOB DETAILS:", response.data);

      setJob(response.data.job);
    } catch (error) {
      console.error("FETCH JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // Select resume
  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Only PDF, DOC and DOCX files are allowed."
      );
      setSuccess("");
      setResume(null);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be less than 5 MB.");
      setSuccess("");
      setResume(null);
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setResume(file);
  };

  // Apply for job
  const handleApply = async () => {
    if (!resume) {
      setError("Please select your resume first.");
      setSuccess("");
      return;
    }

    try {
      setApplying(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("resume", resume);

      const response = await api.post(
        `/applications/apply/${id}`,
        formData
      );

      console.log(
        "APPLICATION RESPONSE:",
        response.data
      );

      setSuccess(
        "Application submitted successfully!"
      );

      setResume(null);

      // Clear file input
      const fileInput =
        document.getElementById("resume");

      if (fileInput) {
        fileInput.value = "";
      }

      setTimeout(() => {
        navigate("/my-applications");
      }, 1500);
    } catch (error) {
      console.error("APPLY JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to apply for this job"
      );
    } finally {
      setApplying(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="job-details-page">
        <style>{`
          * {
            box-sizing: border-box;
          }

          .job-details-page {
            min-height: 100vh;
            background: #f5f7fb;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Arial,
              sans-serif;
          }

          .loading-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
          }

          .loading-card {
            background: #ffffff;
            padding: 40px 55px;
            border-radius: 18px;
            text-align: center;
            box-shadow:
              0 10px 35px rgba(0, 0, 0, 0.07);
          }

          .spinner {
            width: 45px;
            height: 45px;
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-card h2 {
            margin: 0 0 7px;
            color: #111827;
            font-size: 20px;
          }

          .loading-card p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
          }
        `}</style>

        <div
          className="loading-page"
          role="status"
          aria-live="polite"
        >
          <div className="loading-card">
            <div className="spinner"></div>

            <h2>Loading job...</h2>

            <p>
              Please wait while we fetch the job details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= JOB NOT FOUND =================

  if (!job) {
    return (
      <div className="job-details-page">
        <style>{`
          * {
            box-sizing: border-box;
          }

          .job-details-page {
            min-height: 100vh;
            background: #f5f7fb;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Arial,
              sans-serif;
          }

          .not-found {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
          }

          .not-found-card {
            background: white;
            width: 100%;
            max-width: 500px;
            text-align: center;
            padding: 55px 30px;
            border-radius: 18px;
            box-shadow:
              0 10px 35px rgba(0, 0, 0, 0.07);
          }

          .not-found-icon {
            width: 70px;
            height: 70px;
            margin: 0 auto 20px;
            background: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          }

          .not-found-card h2 {
            margin: 0 0 10px;
            color: #111827;
          }

          .not-found-card p {
            color: #6b7280;
            margin-bottom: 25px;
          }

          .back-button {
            display: inline-block;
            text-decoration: none;
            background: #2563eb;
            color: white;
            padding: 11px 20px;
            border-radius: 9px;
            font-weight: 600;
          }

          .back-button:hover {
            background: #1d4ed8;
          }
        `}</style>

        <div className="not-found">
          <div className="not-found-card">

            <div className="not-found-icon">
              ⚠️
            </div>

            <h2>Job not found</h2>

            <p>
              This job may have been removed or is
              no longer available.
            </p>

            <Link
              to="/candidate-dashboard"
              className="back-button"
            >
              ← Back to Jobs
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">

      <style>{`
        * {
          box-sizing: border-box;
        }

        .job-details-page {
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

        .navbar {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.04);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 800;
        }

        .brand-title {
          margin: 0;
          color: #111827;
          font-size: 21px;
          font-weight: 750;
        }

        .back-link {
          text-decoration: none;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 15px;
          border-radius: 9px;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        /* ================= MAIN ================= */

        .main {
          width: 88%;
          max-width: 1150px;
          margin: 0 auto;
          padding: 42px 0 70px;
        }

        .page-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.55fr)
            minmax(300px, 0.75fr);
          gap: 25px;
          align-items: start;
        }

        /* ================= JOB CARD ================= */

        .job-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 34px;
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .job-header {
          border-bottom: 1px solid #edf0f4;
          padding-bottom: 25px;
          margin-bottom: 25px;
        }

        .job-badge {
          display: inline-flex;
          background: #eff6ff;
          color: #2563eb;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .job-title {
          margin: 0 0 8px;
          color: #111827;
          font-size: 32px;
          line-height: 1.2;
          letter-spacing: -0.6px;
        }

        .company {
          margin: 0;
          color: #2563eb;
          font-size: 17px;
          font-weight: 650;
        }

        /* ================= JOB INFO ================= */

        .info-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .info-card {
          background: #f8fafc;
          border: 1px solid #eef1f5;
          border-radius: 12px;
          padding: 16px;
        }

        .info-label {
          display: block;
          color: #9ca3af;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .info-value {
          display: block;
          color: #374151;
          font-size: 14px;
          font-weight: 650;
        }

        /* ================= SECTIONS ================= */

        .section {
          margin-top: 30px;
        }

        .section-title {
          margin: 0 0 14px;
          color: #111827;
          font-size: 20px;
        }

        .description {
          margin: 0;
          color: #4b5563;
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .divider {
          height: 1px;
          background: #edf0f4;
          border: none;
          margin: 30px 0;
        }

        /* ================= SKILLS ================= */

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .skill {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          padding: 7px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        /* ================= APPLY SIDEBAR ================= */

        .apply-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 26px;
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 95px;
        }

        .apply-card h2 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 21px;
        }

        .apply-subtitle {
          margin: 0 0 22px;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.6;
        }

        /* ================= MESSAGES ================= */

        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 13px 14px;
          border-radius: 9px;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.5;
        }

        .success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          padding: 13px 14px;
          border-radius: 9px;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.5;
        }

        /* ================= UPLOAD ================= */

        .upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 13px;
          padding: 20px;
          text-align: center;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .upload-box:hover {
          border-color: #60a5fa;
          background: #f0f7ff;
        }

        .upload-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #dbeafe;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 21px;
        }

        .upload-label {
          display: block;
          color: #374151;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          cursor: pointer;
        }

        .file-input {
          width: 100%;
          font-size: 12px;
          color: #6b7280;
        }

        .file-input::file-selector-button {
          border: none;
          background: #e0e7ff;
          color: #3730a3;
          padding: 8px 12px;
          border-radius: 7px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 8px;
        }

        .upload-help {
          display: block;
          margin-top: 11px;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.5;
        }

        .selected-file {
          margin: 13px 0 0;
          background: #ecfdf5;
          color: #047857;
          border-radius: 8px;
          padding: 9px;
          font-size: 12px;
          word-break: break-word;
        }

        /* ================= APPLY BUTTON ================= */

        .apply-button {
          width: 100%;
          margin-top: 18px;
          padding: 14px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow:
            0 6px 16px rgba(37, 99, 235, 0.2);
        }

        .apply-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 9px 22px rgba(37, 99, 235, 0.3);
        }

        .apply-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ================= APPLY INFO ================= */

        .apply-note {
          margin: 16px 0 0;
          padding-top: 15px;
          border-top: 1px solid #edf0f4;
          color: #9ca3af;
          font-size: 11px;
          line-height: 1.6;
          text-align: center;
        }

        /* ================= ACCESSIBILITY ================= */

        .back-link:focus-visible,
        .apply-button:focus-visible,
        .file-input:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.3);
          outline-offset: 3px;
        }

        /* ================= TABLET ================= */

        @media (max-width: 900px) {
          .navbar {
            padding: 0 4%;
          }

          .main {
            width: 92%;
          }

          .page-layout {
            grid-template-columns: 1fr;
          }

          .apply-card {
            position: static;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 600px) {
          .navbar {
            height: auto;
            min-height: 68px;
            padding: 12px 5%;
          }

          .brand-icon {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }

          .brand-title {
            font-size: 18px;
          }

          .back-link {
            padding: 8px 10px;
            font-size: 12px;
          }

          .main {
            width: 92%;
            padding: 25px 0 50px;
          }

          .job-card {
            padding: 21px;
            border-radius: 15px;
          }

          .job-title {
            font-size: 26px;
          }

          .company {
            font-size: 15px;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .apply-card {
            padding: 21px;
            border-radius: 15px;
          }

          .section-title {
            font-size: 18px;
          }

          .description {
            font-size: 14px;
          }
        }

          .applications-closed-box {
          display: flex;
          align-items: center;
          gap: 14px;

          padding: 16px 18px;

          border: 1px solid #fecaca;
          border-radius: 10px;

          background: #fef2f2;
          color: #991b1b;
        }

        .closed-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fee2e2;

          font-size: 20px;

          flex-shrink: 0;
        }

        .applications-closed-box h3 {
          margin: 0 0 4px;

          font-size: 15px;

          color: #991b1b;
        }

        .applications-closed-box p {
          margin: 0;

          font-size: 13px;

          color: #b91c1c;
        }

        @media (max-width: 600px) {
          .applications-closed-box {
            align-items: flex-start;
          }
        }
      `}</style>

      {/* ================= NAVBAR ================= */}

      <nav
        className="navbar"
        aria-label="Job details navigation"
      >
        <div className="brand">
          <div className="brand-icon">
            J
          </div>

          <h2 className="brand-title">
            Job Portal
          </h2>
        </div>

        <Link
          to="/candidate-dashboard"
          className="back-link"
        >
          ← Back to Jobs
        </Link>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="main">

        <div className="page-layout">

          {/* ================= JOB INFORMATION ================= */}

          <article className="job-card">

            <header className="job-header">

              <span className="job-badge">
                💼 Job Opportunity
              </span>

              <h1 className="job-title">
                {job.title}
              </h1>

              <p className="company">
                {job.company}
              </p>

            </header>

            {/* JOB INFORMATION */}

            <div className="info-grid">

              <div className="info-card">
                <span className="info-label">
                  Location
                </span>

                <span className="info-value">
                  📍 {job.location || "Not specified"}
                </span>
              </div>

              <div className="info-card">
                <span className="info-label">
                  Salary
                </span>

                <span className="info-value">
                  💰 {job.salary || "Not specified"}
                </span>
              </div>

              <div className="info-card">
                <span className="info-label">
                  Job Type
                </span>

                <span className="info-value">
                  💼 {job.jobType || "Not specified"}
                </span>
              </div>

              <div className="info-card">
                <span className="info-label">
                  Experience
                </span>

                <span className="info-value">
                  🎯 {job.experience || "Not specified"}
                </span>
              </div>

            </div>

            {/* DESCRIPTION */}

            <section className="section">

              <h2 className="section-title">
                Job Description
              </h2>

              <p className="description">
                {job.description ||
                  "No job description available."}
              </p>

            </section>

            <hr className="divider" />

            {/* SKILLS */}

            <section className="section">

              <h2 className="section-title">
                Required Skills
              </h2>

              {job.skills?.length > 0 ? (
                <div className="skills">
                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="skill"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="description">
                  No specific skills mentioned.
                </p>
              )}

            </section>

          </article>

          {/* ================= APPLY SECTION ================= */}

          <aside className="apply-card">

            <h2>
              Apply for this Job
            </h2>

            <p className="apply-subtitle">
              Submit your resume to apply for this
              position. Make sure your resume is
              up to date.
            </p>

            {/* ERROR */}

            {error && (
              <div
                className="error"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                className="success"
                role="status"
                aria-live="polite"
              >
                {success}
              </div>
            )}

            {/* UPLOAD */}

            <div className="upload-box">

              <div className="upload-icon">
                📄
              </div>

              <label
                htmlFor="resume"
                className="upload-label"
              >
                Upload Your Resume
              </label>

              <input
                id="resume"
                className="file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                aria-describedby="resume-help"
              />

              <small
                id="resume-help"
                className="upload-help"
              >
                Accepted formats: PDF, DOC, DOCX
                <br />
                Maximum file size: 5 MB
              </small>

              {resume && (
                <p className="selected-file">
                  ✓ Selected:{" "}
                  <strong>
                    {resume.name}
                  </strong>
                </p>
              )}

            </div>
            {/* APPLY BUTTON / CLOSED MESSAGE */}

            {(job.status || "Active") === "Closed" ? (
              <div className="applications-closed-box">
                <div className="closed-icon">
                  🔒
                </div>

                <div>
                  <h3>Applications Closed</h3>

                  <p>
                    This job is no longer accepting applications.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="apply-button"
                aria-busy={applying}
              >
                {applying
                  ? "Submitting Application..."
                  : "Apply Now"}
              </button>
            )}

            <p className="apply-note">
              By applying, your resume will be shared
              with the recruiter for this job.
            </p>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default JobDetails;

