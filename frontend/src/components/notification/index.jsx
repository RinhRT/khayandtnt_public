import React, { useEffect } from "react";
import "./Notification.scss";
import { FaInfo, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Tự động đóng thông báo sau 5 giây
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="icon" />;
      case "error":
        return <FaExclamationTriangle className="icon" />;
      case "info":
        return <FaInfo className="icon" />;
      default:
        return null;
    }
  };

  return (
    <div className={`notification ${type} active`}>
      <div className="notification-content">
        <div className="icons">
          {getIcon()}
        </div>
        <span className="message">{message}</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Notification;
