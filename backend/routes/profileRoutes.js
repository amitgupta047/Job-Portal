const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  uploadResume,
} = require("../controllers/profileController.js");

const {
  protect,
  candidateOnly,
} = require("../middlewares/authMiddleware.js");

const uploadProfileResume = require("../middlewares/profileUpload.js");

const router = express.Router();

// GET candidate profile
router.get(
  "/me",
  protect,
  candidateOnly,
  getMyProfile
);

// UPDATE candidate profile
router.put(
  "/me",
  protect,
  candidateOnly,
  updateMyProfile
);

// UPLOAD / UPDATE resume
router.post(
  "/resume",
  protect,
  candidateOnly,
  uploadProfileResume.single("resume"),
  uploadResume
);

module.exports = router;