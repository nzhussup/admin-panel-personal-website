import React from "react";

const PopUp = ({ closePopup, title, children, onSubmit }) => {
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
      }}
    >
      <div
        className='popup-content'
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          position: "relative",
        }}
      >
        <h5>{title}</h5>
        <form onSubmit={handleSubmit}>
          {children} {/* This is where your form fields will be rendered */}
          <div className='d-flex justify-content-between'>
            <button className='btn btn-primary' type='submit'>
              Save
            </button>
            <button
              className='btn btn-secondary'
              type='button'
              onClick={closePopup}
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
