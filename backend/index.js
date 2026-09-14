require("dotenv").config();

const path = require("path");
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
const notificationRoutes = require("./routes/notificationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();

const PORT = process.env.PORT || 8001;

// ========================================
// HELMET
// ========================================

app.use(helmet());

// ========================================
// CORS
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-pearl-eight.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // e.g. Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED ORIGIN:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

// ========================================
// RATE LIMITER
// ========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ========================================
// AUTH ROUTES
// ========================================

app.use(
  "/api/auth",
  authRouter
);

// ========================================
// JOB ROUTES
// ========================================

app.use(
  "/api/jobs",
  jobRoutes
);

// ========================================
// APPLICATION ROUTES
// ========================================

app.use(
  "/api/applications",
  applicationRoute
);

// ========================================
// PROFILE ROUTES
// ========================================

app.use(
  "/api/profile",
  profileRoutes
);

// ========================================
// SAVED JOB ROUTES
// ========================================

app.use(
  "/api/saved-jobs",
  savedJobRoutes
);

// ========================================
// NOTIFICATION ROUTES
// ========================================

app.use(
  "/api/notifications",
  notificationRoutes
);

// ========================================
// RECRUITER ROUTES
// ========================================

app.use(
  "/api/recruiter",
  recruiterRoutes
);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is running",
  });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use(
  (err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.status || 500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );

  console.log(
    "Allowed CORS origins:",
    allowedOrigins
  );
});

