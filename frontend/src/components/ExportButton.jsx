import React from "react";

const ExportButton = ({ onClick, text }) => {
  return (
    <button
      className='btn btn-outline-primary d-flex align-items-center'
      style={{ fontSize: "1rem", padding: "0.375rem 0.75rem" }}
      onClick={onClick ? () => onClick() : null}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        fill='currentColor'
        className='bi bi-download me-2'
        viewBox='0 0 16 16'
        data-testid='export-icon'
      >
        <path d='M.5 9.9A.5.5 0 0 1 1 9h2v4h10V9h2a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5zM7.5 1.5a.5.5 0 0 1 1 0v7.793l2.146-2.147a.5.5 0 0 1 .708.708L8 10.207l-3.354-3.353a.5.5 0 0 1 .708-.708L7.5 9.293V1.5z' />
      </svg>
      {text ? text : "Export"}
    </button>
  );
};

export default ExportButton;
