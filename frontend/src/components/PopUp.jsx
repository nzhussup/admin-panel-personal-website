import React from "react";
import { useDarkMode } from "../context/DarkModeContext";

const PopUp = ({ closePopup, title, children, onSubmit }) => {
  const { isDarkMode } = useDarkMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className='popup-overlay'
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
        style={{
          background: isDarkMode ? "#2a2a2a" : "white",
          color: isDarkMode ? "#e0e0e0" : "#000",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          overflowY: "auto",
          maxHeight: "90vh",
          border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
        }}
      >
        <h5>{title}</h5>
        <form onSubmit={handleSubmit}>
          {children}
          <div className='d-flex justify-content-between mt-3'>
            <button
              className='btn btn-primary'
              type='submit'
              style={{
                backgroundColor: isDarkMode ? "#3a3a3a" : "#007bff",
                color: isDarkMode ? "#e0e0e0" : "#fff",
              }}
            >
              Save
            </button>
            <button
              className='btn btn-secondary'
              type='button'
              onClick={closePopup}
              style={{
                backgroundColor: isDarkMode ? "#505050" : "#f8f9fa",
                color: isDarkMode ? "#e0e0e0" : "#000",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
