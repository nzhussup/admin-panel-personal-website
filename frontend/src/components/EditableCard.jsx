import React from "react";
import { useDarkMode } from "../context/DarkModeContext";

const EditableCard = ({ title, children, onEdit, onDelete }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className='card mb-3'
      style={{
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
      onClick={() => {
        if (onEdit) {
          onEdit();
        }
      }}
    >
      <div className='card-body'>
        {title && (
          <h5
            className='card-title'
            style={{
              fontWeight: "600",
              fontSize: "1.2rem",
              color: isDarkMode ? "white" : "#333",
              marginBottom: "15px",
            }}
          >
            {title}
          </h5>
        )}

        <div>{children}</div>

        <div className='d-flex justify-content-end mt-3'>
          {/* {onEdit && (
            <button
              className='btn btn-sm btn-outline-secondary mx-2'
              onClick={onEdit}
              style={{
                borderRadius: "30px",
                padding: "6px 15px",
                fontSize: "0.85rem",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              Edit
            </button>
          )} */}
          {onDelete && (
            <button
              className='btn btn-sm btn-outline-danger'
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={{
                borderRadius: "30px",
                padding: "6px 15px",
                fontSize: "0.85rem",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Hover effect for the card */}
      <style>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .card-body {
          padding: 20px;
        }

        .btn-outline-secondary:hover {
          background-color: #f0f0f0;
          border-color: #ccc;
        }

        .btn-outline-danger:hover {
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default EditableCard;
