
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const JobCard = ({ job, isSaved = false, onSavedChange }) => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  // Keep local state synchronized with parent
  // when saved jobs are loaded/updated from CandidateDashboard.
  if (saved !== isSaved && !saving) {
    setSaved(isSaved);
  }

  // =========================================================
  // SAVE / UNSAVE JOB
  // =========================================================

  const handleSaveJob = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      if (saved) {
        // ---------------------------------------------------
        // REMOVE SAVED JOB
        // ---------------------------------------------------

        await api.delete(`/saved-jobs/${job._id}`);

        setSaved(false);

        // Tell CandidateDashboard that this job was unsaved
        if (onSavedChange) {
          onSavedChange(job._id, false);
        }
      } else {
        // ---------------------------------------------------
        // SAVE JOB
        // ---------------------------------------------------

        await api.post(`/saved-jobs/${job._id}`);

        setSaved(true);

        // Tell CandidateDashboard that this job was saved
        if (onSavedChange) {
          onSavedChange(job._id, true);
        }
      }
    } catch (error) {
      console.error("SAVE JOB ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving the job."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // VIEW DETAILS
  // =========================================================

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`);
  };

  // =========================================================
  // BOOKMARK ICON
  // =========================================================

  const BookmarkIcon = ({ filled = false }) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );

  return (
    <div style={styles.card}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{job.title}</h2>

          <p style={styles.company}>{job.company}</p>
        </div>

        {/* =================================================
            TOP RIGHT BOOKMARK
        ================================================= */}

        <button
          type="button"
          onClick={handleSaveJob}
          disabled={saving}
          style={{
            ...styles.saveButton,
            ...(saved ? styles.savedButton : {}),
            ...(saving ? styles.disabledButton : {}),
          }}
          title={
            saved
              ? "Remove from saved jobs"
              : "Save job"
          }
        >
          {saving ? (
            <span style={styles.loadingText}>...</span>
          ) : (
            <BookmarkIcon filled={saved} />
          )}
        </button>
      </div>

      {/* =====================================================
          JOB INFORMATION
      ===================================================== */}

      <p>
        <strong>Location:</strong>{" "}
        {job.location || "Not specified"}
      </p>

      <p>
        <strong>Salary:</strong>{" "}
        {job.salary !== undefined &&
        job.salary !== null &&
        job.salary !== ""
          ? `₹${Number(job.salary).toLocaleString("en-IN")}`
          : "Not specified"}
      </p>

      <p>
        <strong>Job Type:</strong>{" "}
        {job.jobType || "Not specified"}
      </p>

      <p>
        <strong>Experience:</strong>{" "}
        {job.experience || "Not specified"}
      </p>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      {Array.isArray(job.skills) &&
        job.skills.length > 0 && (
          <div style={styles.skills}>
            {job.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                style={styles.skill}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div style={styles.actions}>
        {/* View Details */}

        <button
          type="button"
          onClick={handleViewDetails}
          style={styles.button}
        >
          View Details
        </button>

        {/* Save Job */}

        <button
          type="button"
          onClick={handleSaveJob}
          disabled={saving}
          style={{
            ...styles.saveTextButton,
            ...(saved ? styles.savedTextButton : {}),
            ...(saving ? styles.disabledTextButton : {}),
          }}
        >
          <BookmarkIcon filled={saved} />

          <span>
            {saving
              ? "Saving..."
              : saved
              ? "Saved"
              : "Save Job"}
          </span>
        </button>
      </div>
    </div>
  );
};

// =============================================================
// STYLES
// =============================================================

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  title: {
    margin: "0 0 5px 0",
  },

  company: {
    margin: "0 0 15px 0",
    color: "#6b7280",
    fontWeight: "500",
  },

  saveButton: {
    width: "44px",
    height: "44px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    transition: "all 0.2s ease",
  },

  savedButton: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderColor: "#2563eb",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  loadingText: {
    fontSize: "16px",
    fontWeight: "600",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    margin: "15px 0",
  },

  skill: {
    backgroundColor: "#e5e7eb",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  saveTextButton: {
    padding: "10px 18px",
    border: "1px solid #2563eb",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#2563eb",
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",

    transition: "all 0.2s ease",
  },

  savedTextButton: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderColor: "#2563eb",
  },

  disabledTextButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default JobCard;

