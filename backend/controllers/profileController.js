const User = require("../models/user.js");
const fs = require("fs");
const path = require("path");

// ========================================
// GET MY PROFILE
// ========================================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ========================================
// UPDATE MY PROFILE
// ========================================
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      skills,
      experience,
      linkedin,
      github,
      degree,
      college,
      graduationYear,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic information
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (experience !== undefined) {
      user.experience = experience.trim();
    }

    if (linkedin !== undefined) {
      user.linkedin = linkedin.trim();
    }

    if (github !== undefined) {
      user.github = github.trim();
    }

    // Skills
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills
          .map((skill) => String(skill).trim())
          .filter(Boolean);
      } else {
        user.skills = String(skills)
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    // Education
    if (
      degree !== undefined ||
      college !== undefined ||
      graduationYear !== undefined
    ) {
      user.education = {
        degree:
          degree !== undefined
            ? degree.trim()
            : user.education?.degree || "",

        college:
          college !== undefined
            ? college.trim()
            : user.education?.college || "",

        graduationYear:
          graduationYear !== undefined
            ? graduationYear.trim()
            : user.education?.graduationYear || "",
      };
    }

    await user.save();

    const updatedUser = await User.findById(
      user._id
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ========================================
// UPLOAD RESUME
// ========================================
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete previous resume
    if (user.resume) {
      const oldResumePath = path.join(
        __dirname,
        "..",
        user.resume.replace(/^\/+/, "")
      );

      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    // Save new resume path
    user.resume = `/uploads/profiles/${req.file.filename}`;

    await user.save();

    const updatedUser = await User.findById(
      user._id
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

    // Delete newly uploaded file if database update fails
    if (req.file) {
      const uploadedFile = path.join(
        __dirname,
        "../uploads/profiles",
        req.file.filename
      );

      if (fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResume,
};