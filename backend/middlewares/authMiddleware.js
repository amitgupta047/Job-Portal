const jwt = require("jsonwebtoken");
const User = require("../models/user.js");


// Protect route
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.userId
        ).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// Recruiter only
const recruiterOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }

    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            success: false,
            message: "Recruiter access required"
        });
    }

    next();
};

const candidateOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  if (req.user.role !== "candidate") {
    return res.status(403).json({
      success: false,
      message: "Candidate access required",
    });
  }

  next();
};


module.exports = {
    protect,
    recruiterOnly,
    candidateOnly
};