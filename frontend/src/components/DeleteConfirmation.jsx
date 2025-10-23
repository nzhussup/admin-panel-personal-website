import React from "react";
import { useDarkMode } from "../context/DarkModeContext";

const DeleteConfirmation = ({ isOpen, onClose, onConfirm }) => {
  const { isDarkMode } = useDarkMode();

  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='delete-confirmation-title'
      className='popup-overlay'
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        className='popup-content'
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDarkMode ? "#2a2a2a" : "white",
          color: isDarkMode ? "#e0e0e0" : "#000",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "500px",
          position: "relative",
          overflowY: "auto",
          maxHeight: "90vh",
          border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
        }}
      >
        <div>
          <h5 id='delete-confirmation-title'>Confirm Deletion</h5>
          <p>Are you sure you want to delete this item?</p>
        </div>
        <div className='d-flex justify-content-between mt-3'>
          <button
            className='btn btn-secondary'
            onClick={onClose}
            style={{
              backgroundColor: isDarkMode ? "#505050" : "#f8f9fa",
              color: isDarkMode ? "#e0e0e0" : "#000",
            }}
          >
            Cancel
          </button>
          <button
            className='btn btn-danger'
            onClick={onConfirm}
            style={{
              backgroundColor: isDarkMode ? "#d9534f" : "#dc3545",
              color: "#fff",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
