const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        discription: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        salary: {
            type: Number,
            required: true,
            min: 0,
        },

        skills: {
            type: [String],
            required: true,
            set: (skills) => skills.map((skill) => skill.trim()),
        },

        jobType: {
            type: String,
            required: true,
            enum: [
                "Full Time",
                "Part Time",
                "Internship",
                "Remote",
                "Contract",
            ],
        },

        experience: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active",
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// =====================================
// MONGODB INDEXES
// =====================================

// Latest jobs
jobSchema.index({
    createdAt: -1,
});

// Location + Job Type + Latest jobs
jobSchema.index({
    location: 1,
    jobType: 1,
    createdAt: -1,
});

// Experience + Latest jobs
jobSchema.index({
    experience: 1,
    createdAt: -1,
});

// Salary filtering
jobSchema.index({
    salary: 1,
    createdAt: -1,
});

// Skills filtering
jobSchema.index({
    skills: 1,
});

// Recruiter ke jobs
jobSchema.index({
    recruiter: 1,
    createdAt: -1,
});



const Job = mongoose.model('Job', jobSchema);

module.exports = Job;