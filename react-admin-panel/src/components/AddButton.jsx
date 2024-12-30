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
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='30'
          fill='currentColor'
          className='bi bi-plus'
          viewBox='0 0 16 16'
          style={{ color: "white" }}
        >
          <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
        </svg>
      </button>
    </div>
  );
};

export default AddButton;
