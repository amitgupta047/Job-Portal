const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const {
  protect,
  candidateOnly,
} = require("../middlewares/authMiddleware");

// ========================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ========================================

router.get(
  "/",
  protect,
  candidateOnly,
  getMyNotifications
);

// ========================================
// MARK ALL AS READ
// PUT /api/notifications/read-all
// ========================================

router.put(
  "/read-all",
  protect,
  candidateOnly,
  markAllNotificationsAsRead
);

// ========================================
// MARK ONE AS READ
// PUT /api/notifications/:id/read
// ========================================

router.put(
  "/:id/read",
  protect,
  candidateOnly,
  markNotificationAsRead
);

// ========================================
// DELETE NOTIFICATION
// DELETE /api/notifications/:id
// ========================================

router.delete(
  "/:id",
  protect,
  candidateOnly,
  deleteNotification
);

module.exports = router;

