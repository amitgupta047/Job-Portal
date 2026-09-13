const Notification = require("../models/notification");

// ================================
// GET MY NOTIFICATIONS
// ================================

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id
        })
            .populate("job", "title company")
            .sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            unreadCount,
            notifications
        });

    } catch (error) {
        console.error(
            "GET NOTIFICATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// MARK ONE NOTIFICATION AS READ
// ================================

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: id,
                    recipient: req.user._id
                },
                {
                    isRead: true
                },
                {
                    new: true
                }
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error(
            "MARK NOTIFICATION READ ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// MARK ALL NOTIFICATIONS AS READ
// ================================

const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "MARK ALL NOTIFICATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ================================
// DELETE NOTIFICATION
// ================================

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification =
            await Notification.findOneAndDelete({
                _id: id,
                recipient: req.user._id
            });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {
        console.error(
            "DELETE NOTIFICATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};