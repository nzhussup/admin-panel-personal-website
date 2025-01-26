import React, { useState } from "react";
import "./GlobalAlert.css";

const GlobalAlert = ({ message, show, onClose, type = "alert-success" }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!show && !isDismissed) return null;

  return (
    <div
      className={`alert ${type} alert-dismissible fade show custom-alert ${
        isDismissed ? "dismissed" : ""
      }`}
      role='alert'
    >
      {message}
      <button
        type='button'
        className='btn-close'
        aria-label='Close'
        onClick={handleDismiss}
      ></button>
    </div>
  );
};

export default GlobalAlert;
