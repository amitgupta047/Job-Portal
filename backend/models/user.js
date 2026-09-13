const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic authentication information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
    },

    // =========================
    // Candidate Profile
    // =========================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      degree: {
        type: String,
        trim: true,
        default: "",
      },

      college: {
        type: String,
        trim: true,
        default: "",
      },

      graduationYear: {
        type: String,
        trim: true,
        default: "",
      },
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.user || mongoose.model("user", userSchema);