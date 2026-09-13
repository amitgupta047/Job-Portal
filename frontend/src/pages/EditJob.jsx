
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "Full Time",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // GET JOB DETAILS
  // ========================================

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${id}`);

      const job = response.data.job;

      if (!job) {
        setError("Job not found.");
        return;
      }

      setFormData({
        title: job.title || "",
        company: job.company || "",
        description: job.description || "",
        location: job.location || "",
        salary: job.salary || "",
        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : job.skills || "",
        jobType: job.jobType || "Full Time",
        experience: job.experience || "",
      });
    } catch (error) {
      console.error("FETCH JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD JOB
  // ========================================

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // UPDATE JOB
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await api.put(`/jobs/${id}`, {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        skills: skillsArray,
        jobType: formData.jobType,
        experience: formData.experience,
      });

      if (response.data.success) {
        setSuccess("Job updated successfully!");

        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("UPDATE JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <>
        <style>{`
          .edit-loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #f5f7fb;
            color: #374151;
            font-family: Arial, Helvetica, sans-serif;
          }

          .edit-loader {
            width: 42px;
            height: 42px;

            border: 4px solid #e5e7eb;
            border-top: 4px solid #2563eb;

            border-radius: 50%;

            animation: editSpin 0.8s linear infinite;

            margin-bottom: 18px;
          }

          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          @keyframes editSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div
          className="edit-loading-page"
          role="status"
          aria-live="polite"
        >
          <div
            className="edit-loader"
            aria-hidden="true"
          ></div>

          <h2>Loading job...</h2>

          <span className="sr-only">
            Please wait while the job details are loading.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ========================================
          CSS
      ======================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f7fb;
        }

        .edit-job-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding-bottom: 50px;
        }

        /* ==============================
           NAVBAR
        ============================== */

        .edit-job-navbar {
          height: 70px;
          background: #ffffff;

          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7%;
        }

        .edit-job-navbar h2 {
          margin: 0;

          color: #2563eb;
          font-size: 24px;
        }

        .back-dashboard-btn {
          border: none;

          padding: 10px 18px;

          border-radius: 7px;

          background: #2563eb;
          color: white;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .back-dashboard-btn:hover {
          background: #1d4ed8;
        }

        .back-dashboard-btn:focus-visible,
        .update-job-btn:focus-visible,
        .cancel-btn:focus-visible {
          outline: 3px solid #93c5fd;
          outline-offset: 2px;
        }

        /* ==============================
           CONTAINER
        ============================== */

        .edit-job-container {
          width: 90%;
          max-width: 850px;

          margin: 40px auto;
        }

        .edit-job-container h1 {
          text-align: center;

          margin: 0 0 30px;

          color: #111827;

          font-size: 32px;
        }

        /* ==============================
           FORM
        ============================== */

        .edit-job-form {
          background: #ffffff;

          padding: 35px;

          border-radius: 12px;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-group label {
          display: block;

          margin-bottom: 8px;

          color: #374151;

          font-size: 15px;
          font-weight: 600;
        }

        .required-mark {
          color: #b91c1c;
          margin-left: 3px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;

          padding: 12px 14px;

          border: 1px solid #d1d5db;

          border-radius: 7px;

          background: #ffffff;

          color: #111827;

          font-size: 15px;

          outline: none;

          transition: 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-group input:focus-visible,
        .form-group textarea:focus-visible,
        .form-group select:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 1px;
        }

        .form-group textarea {
          min-height: 140px;

          resize: vertical;
        }

        .form-help {
          display: block;

          margin-top: 6px;

          color: #6b7280;

          font-size: 13px;
        }

        /* ==============================
           ERROR
        ============================== */

        .form-error {
          padding: 12px 15px;

          margin-bottom: 20px;

          border-radius: 7px;

          background: #fee2e2;

          border: 1px solid #fecaca;

          color: #b91c1c;

          font-size: 14px;
        }

        /* ==============================
           SUCCESS
        ============================== */

        .form-success {
          padding: 12px 15px;

          margin-bottom: 20px;

          border-radius: 7px;

          background: #dcfce7;

          border: 1px solid #bbf7d0;

          color: #15803d;

          font-size: 14px;
        }

        /* ==============================
           BUTTONS
        ============================== */

        .update-job-btn {
          width: 100%;

          padding: 13px;

          border: none;

          border-radius: 7px;

          background: #2563eb;

          color: white;

          font-size: 16px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .update-job-btn:hover {
          background: #1d4ed8;
        }

        .update-job-btn:disabled {
          background: #93c5fd;

          cursor: not-allowed;
        }

        .cancel-btn {
          width: 100%;

          margin-top: 12px;

          padding: 12px;

          border: 1px solid #d1d5db;

          border-radius: 7px;

          background: white;

          color: #374151;

          font-size: 15px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;
        }

        .cancel-btn:hover {
          background: #f3f4f6;
        }

        /* ==============================
           RESPONSIVE
        ============================== */

        @media (max-width: 600px) {
          .edit-job-navbar {
            padding: 0 20px;
          }

          .edit-job-navbar h2 {
            font-size: 19px;
          }

          .edit-job-container {
            width: 94%;
            margin-top: 25px;
          }

          .edit-job-container h1 {
            font-size: 26px;
          }

          .edit-job-form {
            padding: 22px;
          }

          .back-dashboard-btn {
            padding: 9px 12px;
          }
        }
      `}</style>

      <div className="edit-job-page">

        {/* ========================================
            NAVBAR
        ======================================== */}

        <nav
          className="edit-job-navbar"
          aria-label="Recruiter navigation"
        >
          <h2>
            Job Portal - Recruiter
          </h2>

          <button
            type="button"
            className="back-dashboard-btn"
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

        <main className="edit-job-container">

          <h1>
            Edit Job
          </h1>

          {/* Accessible status region */}

          <div
            aria-live="polite"
            aria-atomic="true"
          >
            {updating && (
              <p className="sr-only">
                Updating job. Please wait.
              </p>
            )}
          </div>

          <form
            className="edit-job-form"
            onSubmit={handleSubmit}
            aria-busy={updating}
          >

            {/* ERROR */}

            {error && (
              <div
                className="form-error"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div
                className="form-success"
                role="status"
                aria-live="polite"
              >
                {success}
              </div>
            )}

            {/* JOB TITLE */}

            <div className="form-group">

              <label htmlFor="job-title">
                Job Title
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="job-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Associate Software Developer"
                autoComplete="organization-title"
                required
                aria-required="true"
              />

            </div>

            {/* COMPANY */}

            <div className="form-group">

              <label htmlFor="company-name">
                Company
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="company-name"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                autoComplete="organization"
                required
                aria-required="true"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="job-description">
                Job Description
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <textarea
                id="job-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed job description"
                required
                aria-required="true"
              />

            </div>

            {/* LOCATION */}

            <div className="form-group">

              <label htmlFor="job-location">
                Location
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="job-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lucknow / Remote"
                autoComplete="address-level2"
                required
                aria-required="true"
              />

            </div>

            {/* SALARY */}

            <div className="form-group">

              <label htmlFor="job-salary">
                Salary
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="job-salary"
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 5-8 LPA"
                required
                aria-required="true"
              />

            </div>

            {/* SKILLS */}

            <div className="form-group">

              <label htmlFor="job-skills">
                Skills
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="job-skills"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                aria-describedby="skills-help"
                required
                aria-required="true"
              />

              <small
                id="skills-help"
                className="form-help"
              >
                Separate multiple skills using commas.
              </small>

            </div>

            {/* JOB TYPE */}

            <div className="form-group">

              <label htmlFor="job-type">
                Job Type
              </label>

              <select
                id="job-type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
                </option>
              </select>

            </div>

            {/* EXPERIENCE */}

            <div className="form-group">

              <label htmlFor="job-experience">
                Experience
                <span
                  className="required-mark"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>

              <input
                id="job-experience"
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 0-2 years"
                required
                aria-required="true"
              />

            </div>

            {/* UPDATE */}

            <button
              type="submit"
              className="update-job-btn"
              disabled={updating}
              aria-disabled={updating}
            >
              {updating
                ? "Updating Job..."
                : "Update Job"}
            </button>

            {/* CANCEL */}

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/recruiter-dashboard")
              }
            >
              Cancel
            </button>

          </form>

        </main>

      </div>
    </>
  );
};

export default EditJob;

