import React, { useEffect, useState, useRef } from "react";
import { useGlobalAlert } from "../context/GlobalAlertContext";

const GlobalAlert = () => {
  const { alert, closeAlert } = useGlobalAlert();
  const [visible, setVisible] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (alert.show) {
      setVisible(false);

      requestAnimationFrame(() => {
        setVisible(true);
      });

      clearTimeout(hideTimeoutRef.current);

      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        hideTimeoutRef.current = setTimeout(() => {
          closeAlert();
        }, 500);
      }, 3000);
    }

    return () => clearTimeout(hideTimeoutRef.current);
  }, [alert.show, alert.message, closeAlert]);

  if (!alert.show && !visible) return null;

  return (
    <div
      className={`alert alert-${alert.type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`}
      role='alert'
      style={{
        zIndex: 1050,
        minWidth: "300px",
        maxWidth: "90vw",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(-50%, 0)" : "translate(-50%, -20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {alert.message}
    </div>
  );
};

export default GlobalAlert;
