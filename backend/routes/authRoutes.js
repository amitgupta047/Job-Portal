const express = require('express');
const {register,
    login,
    getMe
} = require('../controllers/authController.js')

const {protect} = require('../middlewares/authMiddleware.js')


const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;