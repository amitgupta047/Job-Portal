require("dotenv").config();

const path = require('path')
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRouter = require("./routes/authRoutes.js");
const jobRoutes = require("./routes/jobRoute.js");
const applicationRoute = require("./routes/applicationRoute.js");
const profileRoutes = require("./routes/profileRoutes.js");
const notificationRoutes =
  require("./routes/notificationRoutes");
const savedJobRoutes =
require("./routes/savedJobRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");


const app = express();

const PORT = process.env.PORT || 8001;

app.use(helmet());


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

app.use("/api", apiLimiter);

connectDB();

app.use("/uploads", express.static(path.join(__dirname , "uploads")));

app.use("/api/auth", authRouter);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoute);

app.use("/api/profile", profileRoutes);

app.use(
  "/api/saved-jobs",
  savedJobRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/recruiter", recruiterRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Portal API is running",
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});


app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});