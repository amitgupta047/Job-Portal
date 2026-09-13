
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ========================================
  // FETCH NOTIFICATIONS
  // ========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("FETCH NOTIFICATIONS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ========================================
  // MARK ONE AS READ
  // ========================================

  const markAsRead = async (id) => {
    try {
      setProcessingId(id);

      const response = await api.put(
        `/notifications/${id}/read`
      );

      if (response.data.success) {
        setNotifications((previous) =>
          previous.map((notification) =>
            notification._id === id
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
          )
        );

        setUnreadCount((previous) =>
          previous > 0 ? previous - 1 : 0
        );
      }
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // MARK ALL AS READ
  // ========================================

  const markAllAsRead = async () => {
    try {
      setProcessingId("all");

      const response = await api.put(
        "/notifications/read-all"
      );

      if (response.data.success) {
        setNotifications((previous) =>
          previous.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // DELETE NOTIFICATION
  // ========================================

  const deleteNotification = async (id) => {
    try {
      setProcessingId(id);

      const notification = notifications.find(
        (item) => item._id === id
      );

      const response = await api.delete(
        `/notifications/${id}`
      );

      if (response.data.success) {
        setNotifications((previous) =>
          previous.filter(
            (item) => item._id !== id
          )
        );

        if (notification && !notification.isRead) {
          setUnreadCount((previous) =>
            previous > 0 ? previous - 1 : 0
          );
        }
      }
    } catch (error) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ========================================
  // NOTIFICATION ICON
  // ========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "shortlisted":
        return "⭐";

      case "interview":
        return "📅";

      case "selected":
        return "🎉";

      case "rejected":
        return "❌";

      case "application":
        return "📄";

      default:
        return "🔔";
    }
  };

  // ========================================
  // NOTIFICATION COLOR
  // ========================================

  const getNotificationClass = (type) => {
    switch (type) {
      case "shortlisted":
        return "notification-shortlisted";

      case "interview":
        return "notification-interview";

      case "selected":
        return "notification-selected";

      case "rejected":
        return "notification-rejected";

      case "application":
        return "notification-application";

      default:
        return "notification-general";
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <>
        <style>{`
          .notification-loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f5f7fb;
            font-family: Arial, Helvetica, sans-serif;
            color: #374151;
          }

          .notification-loader {
            width: 42px;
            height: 42px;
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: notificationSpin 0.8s linear infinite;
            margin-bottom: 15px;
          }

          @keyframes notificationSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="notification-loading-page">
          <div className="notification-loader"></div>
          <h2>Loading notifications...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f7fb;
        }

        .notifications-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding-bottom: 50px;
        }

        /* ========================================
           NAVBAR
        ======================================== */

        .notifications-navbar {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7%;
        }

        .notifications-navbar h2 {
          margin: 0;
          color: #2563eb;
          font-size: 23px;
        }

        .notification-back-btn {
          border: none;
          background: #2563eb;
          color: white;

          padding: 10px 17px;
          border-radius: 7px;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        .notification-back-btn:hover {
          background: #1d4ed8;
        }

        /* ========================================
           CONTAINER
        ======================================== */

        .notifications-container {
          width: 92%;
          max-width: 900px;

          margin: 35px auto;
        }

        /* ========================================
           HEADER
        ======================================== */

        .notifications-header {
          background: #ffffff;
          border-radius: 12px;

          padding: 25px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.06);

          margin-bottom: 20px;
        }

        .notifications-header-left h1 {
          margin: 0 0 7px;
          color: #111827;
          font-size: 30px;
        }

        .notifications-header-left p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .unread-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 28px;
          height: 28px;

          padding: 0 8px;

          margin-left: 8px;

          border-radius: 20px;

          background: #ef4444;
          color: white;

          font-size: 13px;
          font-weight: 700;
        }

        .mark-all-btn {
          border: none;

          padding: 10px 15px;

          border-radius: 7px;

          background: #eff6ff;
          color: #2563eb;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        .mark-all-btn:hover {
          background: #dbeafe;
        }

        .mark-all-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ========================================
           ERROR
        ======================================== */

        .notification-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;

          padding: 12px 15px;

          border-radius: 8px;

          margin-bottom: 20px;

          font-size: 14px;
        }

        /* ========================================
           NOTIFICATION CARD
        ======================================== */

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .notification-card {
          background: #ffffff;

          border-radius: 12px;

          padding: 20px;

          display: flex;
          align-items: flex-start;
          gap: 15px;

          border: 1px solid #e5e7eb;

          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.05);

          transition: 0.2s;
        }

        .notification-card:hover {
          transform: translateY(-1px);
          box-shadow:
            0 6px 18px rgba(0, 0, 0, 0.08);
        }

        .notification-card.unread {
          border-left: 4px solid #2563eb;
          background: #f8fbff;
        }

        .notification-icon {
          width: 46px;
          height: 46px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #eff6ff;

          font-size: 21px;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-content h3 {
          margin: 0 0 7px;

          color: #111827;

          font-size: 16px;
        }

        .notification-message {
          margin: 0 0 8px;

          color: #4b5563;

          font-size: 14px;

          line-height: 1.5;
        }

        .notification-job {
          margin: 0 0 8px;

          color: #2563eb;

          font-size: 13px;

          font-weight: 600;
        }

        .notification-date {
          color: #9ca3af;
          font-size: 12px;
        }

        /* ========================================
           ACTIONS
        ======================================== */

        .notification-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;

          flex-shrink: 0;
        }

        .read-btn,
        .delete-btn {
          border: none;

          padding: 8px 11px;

          border-radius: 6px;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;
        }

        .read-btn {
          background: #eff6ff;
          color: #2563eb;
        }

        .read-btn:hover {
          background: #dbeafe;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        .read-btn:disabled,
        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .read-label {
          color: #16a34a;
          font-size: 12px;
          font-weight: 600;
        }

        /* ========================================
           EMPTY STATE
        ======================================== */

        .empty-notifications {
          background: #ffffff;

          border-radius: 12px;

          padding: 60px 20px;

          text-align: center;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.06);
        }

        .empty-icon {
          font-size: 55px;
          margin-bottom: 15px;
        }

        .empty-notifications h2 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 22px;
        }

        .empty-notifications p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        /* ========================================
           TYPE STYLES
        ======================================== */

        .notification-shortlisted .notification-icon {
          background: #fef3c7;
        }

        .notification-interview .notification-icon {
          background: #ede9fe;
        }

        .notification-selected .notification-icon {
          background: #dcfce7;
        }

        .notification-rejected .notification-icon {
          background: #fee2e2;
        }

        .notification-application .notification-icon {
          background: #dbeafe;
        }

        /* ========================================
           RESPONSIVE
        ======================================== */

        @media (max-width: 650px) {
          .notifications-navbar {
            padding: 0 20px;
          }

          .notifications-navbar h2 {
            font-size: 18px;
          }

          .notification-back-btn {
            padding: 8px 11px;
          }

          .notifications-container {
            width: 94%;
            margin-top: 25px;
          }

          .notifications-header {
            padding: 20px;

            align-items: flex-start;
            flex-direction: column;

            gap: 15px;
          }

          .notifications-header-left h1 {
            font-size: 25px;
          }

          .notification-card {
            padding: 16px;
          }

          .notification-actions {
            flex-direction: row;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
        }
      `}</style>

      <div className="notifications-page">

        {/* ========================================
            NAVBAR
        ======================================== */}

        <nav className="notifications-navbar">
          <h2>Job Portal</h2>

          <button
            className="notification-back-btn"
            onClick={() =>
              navigate("/candidate-dashboard")
            }
          >
            Back to Dashboard
          </button>
        </nav>

        {/* ========================================
            MAIN
        ======================================== */}

        <main className="notifications-container">

          {/* HEADER */}

          <div className="notifications-header">

            <div className="notifications-header-left">
              <h1>
                Notifications

                {unreadCount > 0 && (
                  <span className="unread-badge">
                    {unreadCount}
                  </span>
                )}
              </h1>

              <p>
                Stay updated with your job applications.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={markAllAsRead}
                disabled={processingId === "all"}
              >
                {processingId === "all"
                  ? "Marking..."
                  : "Mark all as read"}
              </button>
            )}

          </div>

          {/* ERROR */}

          {error && (
            <div className="notification-error">
              {error}
            </div>
          )}

          {/* ========================================
              NOTIFICATIONS
          ======================================== */}

          {notifications.length === 0 ? (

            <div className="empty-notifications">

              <div className="empty-icon">
                🔔
              </div>

              <h2>
                No notifications yet
              </h2>

              <p>
                You will see updates about your
                applications here.
              </p>

            </div>

          ) : (

            <div className="notifications-list">

              {notifications.map((notification) => (

                <div
                  key={notification._id}
                  className={`
                    notification-card
                    ${notification.isRead ? "" : "unread"}
                    ${getNotificationClass(
                      notification.type
                    )}
                  `}
                >

                  {/* ICON */}

                  <div className="notification-icon">
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="notification-content">

                    <h3>
                      {notification.type
                        ? notification.type
                            .charAt(0)
                            .toUpperCase() +
                          notification.type.slice(1)
                        : "Notification"}
                    </h3>

                    <p className="notification-message">
                      {notification.message}
                    </p>

                    {notification.job && (
                      <p className="notification-job">
                        {notification.job.title}

                        {notification.job.company
                          ? ` • ${notification.job.company}`
                          : ""}
                      </p>
                    )}

                    <span className="notification-date">
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="notification-actions">

                    {!notification.isRead ? (

                      <button
                        className="read-btn"
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        disabled={
                          processingId ===
                          notification._id
                        }
                      >
                        {processingId ===
                        notification._id
                          ? "..."
                          : "Mark read"}
                      </button>

                    ) : (

                      <span className="read-label">
                        ✓ Read
                      </span>

                    )}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                      disabled={
                        processingId ===
                        notification._id
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </main>

      </div>
    </>
  );
};

export default Notifications;

