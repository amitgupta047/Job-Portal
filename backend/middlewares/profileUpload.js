const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directory if it doesn't exist
const uploadDirectory = path.join(
  __dirname,
  "../uploads/profiles"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName = `resume-${req.user._id}-${Date.now()}${extension}`;

    cb(null, fileName);
  },
});

// Only allow PDF resumes
const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    extension === ".pdf" &&
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadProfileResume = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = uploadProfileResume;