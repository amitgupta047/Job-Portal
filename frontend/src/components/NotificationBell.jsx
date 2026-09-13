import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const NotificationIcon = () => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const CloseIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CheckIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const getTypeIcon = (type) => {
    switch (type) {
        case "shortlisted":
            return "🎉";

        case "interview":
            return "📅";

        case "selected":
            return "🎊";

        case "rejected":
            return "❌";

        case "application":
            return "📄";

        default:
            return "🔔";
    }
};

const getTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);

    const seconds = Math.floor(
        (now - notificationDate) / 1000
    );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString();
};

const NotificationBell = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // ==============================
    // FETCH NOTIFICATIONS
    // ==============================

    const fetchNotifications = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            setLoading(true);

            const response =
                await api.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );

            setUnreadCount(
                response.data.unreadCount || 0
            );
        } catch (error) {
            console.error(
                "FETCH NOTIFICATIONS ERROR:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // INITIAL FETCH
    // ==============================

    useEffect(() => {
        fetchNotifications();

        // Refresh every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // ==============================
    // MARK SINGLE NOTIFICATION READ
    // ==============================

    const markAsRead = async (notificationId) => {
        try {
            await api.put(
                `/notifications/${notificationId}/read`
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? {
                              ...notification,
                              isRead: true
                          }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );
        } catch (error) {
            console.error(
                "MARK NOTIFICATION READ ERROR:",
                error
            );
        }
    };

    // ==============================
    // MARK ALL READ
    // ==============================

    const markAllAsRead = async () => {
        try {
            await api.put(
                "/notifications/read-all"
            );

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "MARK ALL NOTIFICATIONS ERROR:",
                error
            );
        }
    };

    // ==============================
    // DELETE NOTIFICATION
    // ==============================

    const deleteNotification = async (
        notificationId,
        wasUnread
    ) => {
        try {
            await api.delete(
                `/notifications/${notificationId}`
            );

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification._id !==
                        notificationId
                )
            );

            if (wasUnread) {
                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }
        } catch (error) {
            console.error(
                "DELETE NOTIFICATION ERROR:",
                error
            );
        }
    };

    // ==============================
    // CLICK NOTIFICATION
    // ==============================

    const handleNotificationClick = async (
        notification
    ) => {
        if (!notification.isRead) {
            await markAsRead(
                notification._id
            );
        }

        if (notification.job?._id) {
            setOpen(false);

            navigate(
                `/jobs/${notification.job._id}`
            );
        }
    };

    return (
        <div style={styles.wrapper}>

            {/* ==============================
                BELL BUTTON
            ============================== */}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={styles.bellButton}
                aria-label="Notifications"
            >
                <NotificationIcon />

                {unreadCount > 0 && (
                    <span style={styles.badge}>
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {/* ==============================
                DROPDOWN
            ============================== */}

            {open && (
                <>

                    {/* Overlay */}
                    <div
                        style={styles.overlay}
                        onClick={() => setOpen(false)}
                    />

                    <div style={styles.dropdown}>

                        {/* Header */}
                        <div style={styles.header}>

                            <div>
                                <h3 style={styles.heading}>
                                    Notifications
                                </h3>

                                {unreadCount > 0 && (
                                    <p style={styles.unreadText}>
                                        {unreadCount} unread
                                    </p>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    style={
                                        styles.markAllButton
                                    }
                                >
                                    Mark all as read
                                </button>
                            )}

                        </div>

                        {/* ==============================
                            LOADING
                        ============================== */}

                        {loading &&
                        notifications.length === 0 ? (
                            <div
                                style={styles.empty}
                            >
                                Loading notifications...
                            </div>
                        ) : notifications.length ===
                          0 ? (

                            /* ==============================
                               EMPTY STATE
                            ============================== */

                            <div
                                style={styles.empty}
                            >
                                <div
                                    style={
                                        styles.emptyIcon
                                    }
                                >
                                    🔔
                                </div>

                                <h4
                                    style={
                                        styles.emptyTitle
                                    }
                                >
                                    No notifications
                                </h4>

                                <p
                                    style={
                                        styles.emptyText
                                    }
                                >
                                    You're all caught up!
                                </p>
                            </div>

                        ) : (

                            /* ==============================
                               NOTIFICATION LIST
                            ============================== */

                            <div
                                style={
                                    styles.notificationList
                                }
                            >

                                {notifications.map(
                                    (notification) => (
                                        <div
                                            key={
                                                notification._id
                                            }
                                            style={{
                                                ...styles.notificationItem,
                                                ...(notification.isRead
                                                    ? {}
                                                    : styles.unreadItem)
                                            }}
                                        >

                                            {/* Icon */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                style={
                                                    styles.iconButton
                                                }
                                            >
                                                {getTypeIcon(
                                                    notification.type
                                                )}
                                            </button>

                                            {/* Content */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                                style={
                                                    styles.contentButton
                                                }
                                            >
                                                <p
                                                    style={
                                                        styles.message
                                                    }
                                                >
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                {notification.job && (
                                                    <p
                                                        style={
                                                            styles.jobInfo
                                                        }
                                                    >
                                                        {
                                                            notification
                                                                .job
                                                                .title
                                                        }

                                                        {notification
                                                            .job
                                                            .company &&
                                                            ` • ${notification.job.company}`}
                                                    </p>
                                                )}

                                                <span
                                                    style={
                                                        styles.time
                                                    }
                                                >
                                                    {getTimeAgo(
                                                        notification.createdAt
                                                    )}
                                                </span>
                                            </button>

                                            {/* Actions */}
                                            <div
                                                style={
                                                    styles.actions
                                                }
                                            >

                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        title="Mark as read"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                        style={
                                                            styles.actionButton
                                                        }
                                                    >
                                                        <CheckIcon />
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    onClick={() =>
                                                        deleteNotification(
                                                            notification._id,
                                                            !notification.isRead
                                                        )
                                                    }
                                                    style={{
                                                        ...styles.actionButton,
                                                        ...styles.deleteButton
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </button>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>
                </>
            )}

        </div>
    );
};

// =====================================
// STYLES
// =====================================

const styles = {
    wrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center"
    },

    bellButton: {
        position: "relative",
        width: "42px",
        height: "42px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "transparent",
        color: "#475569",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        zIndex: 1001
    },

    badge: {
        position: "absolute",
        top: "1px",
        right: "0px",
        minWidth: "18px",
        height: "18px",
        padding: "0 5px",
        borderRadius: "999px",
        backgroundColor: "#ef4444",
        color: "#ffffff",
        fontSize: "10px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #ffffff"
    },

    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 998,
        backgroundColor: "transparent"
    },

    dropdown: {
        position: "absolute",
        top: "50px",
        right: "0",
        width: "390px",
        maxWidth: "calc(100vw - 30px)",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        boxShadow:
            "0 20px 50px rgba(15, 23, 42, 0.15)",
        overflow: "hidden",
        zIndex: 1000
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
        borderBottom: "1px solid #e2e8f0",
        gap: "12px"
    },

    heading: {
        margin: 0,
        color: "#0f172a",
        fontSize: "17px",
        fontWeight: "700"
    },

    unreadText: {
        margin: "3px 0 0",
        color: "#64748b",
        fontSize: "12px"
    },

    markAllButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap"
    },

    notificationList: {
        maxHeight: "430px",
        overflowY: "auto"
    },

    notificationItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "14px 12px",
        borderBottom: "1px solid #f1f5f9",
        transition: "background-color 0.2s ease"
    },

    unreadItem: {
        backgroundColor: "#eff6ff"
    },

    iconButton: {
        flexShrink: 0,
        width: "38px",
        height: "38px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "17px"
    },

    contentButton: {
        flex: 1,
        minWidth: 0,
        border: "none",
        background: "transparent",
        padding: 0,
        textAlign: "left",
        cursor: "pointer"
    },

    message: {
        margin: 0,
        color: "#1e293b",
        fontSize: "13px",
        lineHeight: "1.45",
        fontWeight: "600"
    },

    jobInfo: {
        margin: "4px 0 0",
        color: "#475569",
        fontSize: "11px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },

    time: {
        display: "block",
        marginTop: "5px",
        color: "#94a3b8",
        fontSize: "10px"
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: "3px",
        flexShrink: 0
    },

    actionButton: {
        width: "28px",
        height: "28px",
        border: "none",
        borderRadius: "7px",
        backgroundColor: "transparent",
        color: "#64748b",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    deleteButton: {
        color: "#ef4444"
    },

    empty: {
        padding: "45px 20px",
        textAlign: "center"
    },

    emptyIcon: {
        fontSize: "32px",
        marginBottom: "8px"
    },

    emptyTitle: {
        margin: "0 0 4px",
        color: "#1e293b",
        fontSize: "15px"
    },

    emptyText: {
        margin: 0,
        color: "#94a3b8",
        fontSize: "12px"
    }
};

export default NotificationBell;