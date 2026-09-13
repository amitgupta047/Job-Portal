const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Create upload directory if it doesn't exist
const uploadDir = path.join(
    __dirname,
    "../uploads/resumes"
);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}


// Storage configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


// File type validation
const fileFilter = (req, file, cb) => {


    const extension =
        path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx"
    ];

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, DOC and DOCX files are allowed"
            ),
            false
        );
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});


module.exports = upload;