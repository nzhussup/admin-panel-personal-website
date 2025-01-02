import React from "react";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className='btn btn-outline-primary d-flex align-items-center'
      style={{ fontSize: "1rem", padding: "0.375rem 0.75rem" }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        fill='currentColor'
        className='bi bi-arrow-left-circle-fill me-2'
        viewBox='0 0 16 16'
      >
        <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z' />
      </svg>
      Back
    </button>
  );
};

export default BackArrow;
