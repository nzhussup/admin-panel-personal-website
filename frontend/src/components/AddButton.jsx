import React from "react";

const AddButton = ({ openPopup }) => {
  return (
    <div>
      <button
        className='btn-floating'
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          backgroundColor: "#007bff",
          borderRadius: "50%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          color: "white",
          border: "none",
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
        onClick={() => openPopup()}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        +
      </button>
    </div>
  );
};

export default AddButton;
