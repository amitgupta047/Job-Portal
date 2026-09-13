
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    discription: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "Full Time",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await api.post("/jobs", {
        title: formData.title,
        company: formData.company,
        discription: formData.discription,
        location: formData.location,
        salary: formData.salary,
        skills: skillsArray,
        jobType: formData.jobType,
        experience: formData.experience,
      });

      if (response.data.success) {
        setSuccess("Job created successfully!");

        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .create-job-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding-bottom: 50px;
        }

        /* Navbar */

        .create-job-navbar {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7%;
        }

        .create-job-navbar h2 {
          margin: 0;
          color: #2563eb;
          font-size: 24px;
        }

        .back-dashboard-btn {
          padding: 10px 18px;

          border: none;
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

        /* Container */

        .create-job-container {
          width: 90%;
          max-width: 850px;

          margin: 40px auto;
        }

        .create-job-container h1 {
          text-align: center;
          margin-bottom: 30px;

          color: #111827;
          font-size: 32px;
        }

        /* Form */

        .create-job-form {
          background: white;

          padding: 35px;

          border-radius: 12px;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.08);
        }

        /* Form group */

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

        /* Inputs */

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;

          padding: 12px 14px;

          border: 1px solid #d1d5db;
          border-radius: 7px;

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

        .form-group textarea {
          resize: vertical;
          min-height: 130px;
        }

        /* Small text */

        .form-group small {
          display: block;

          margin-top: 6px;

          color: #6b7280;

          font-size: 13px;
        }

        /* Submit button */

        .create-job-btn {
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

        .create-job-btn:hover {
          background: #1d4ed8;
        }

        .create-job-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        /* Error */

        .form-error {
          padding: 12px;

          margin-bottom: 20px;

          border-radius: 7px;

          background: #fee2e2;
          color: #b91c1c;

          font-size: 14px;
        }

        /* Success */

        .form-success {
          padding: 12px;

          margin-bottom: 20px;

          border-radius: 7px;

          background: #dcfce7;
          color: #15803d;

          font-size: 14px;
        }

        /* Mobile */

        @media (max-width: 600px) {
          .create-job-navbar {
            padding: 0 20px;
          }

          .create-job-navbar h2 {
            font-size: 19px;
          }

          .create-job-container {
            width: 94%;
            margin-top: 25px;
          }

          .create-job-form {
            padding: 22px;
          }

          .create-job-container h1 {
            font-size: 26px;
          }
        }
      `}</style>

      <div className="create-job-page">

        {/* Navbar */}

        <nav className="create-job-navbar">
          <h2>Job Portal</h2>

          <button
            className="back-dashboard-btn"
            type="button"
            onClick={() =>
              navigate("/recruiter-dashboard")
            }
          >
            Back to Dashboard
          </button>
        </nav>

        {/* Main */}

        <main className="create-job-container">

          <h1>Create New Job</h1>

          <form
            className="create-job-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-success">
                {success}
              </div>
            )}

            <div className="form-group">
              <label>Job Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Associate Software Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Company</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Discription</label>

              <textarea
                name="discription"
                value={formData.discription}
                onChange={handleChange}
                placeholder="Enter detailed job description"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Lucknow / Remote"
                required
              />
            </div>

            <div className="form-group">
              <label>Salary</label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 60000"
                required
              />
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                required
              />

              <small>
                Separate multiple skills using commas.
              </small>
            </div>

            <div className="form-group">
              <label>Job Type</label>

              <select
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

            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 0-2 years"
                required
              />
            </div>

            <button
              className="create-job-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Job..."
                : "Create Job"}
            </button>

          </form>

        </main>
      </div>
    </>
  );
};

export default CreateJob;

