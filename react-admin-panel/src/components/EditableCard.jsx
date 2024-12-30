import React from "react";

const EditableCard = ({ title, children, onEdit, onDelete }) => {
  return (
    <div
      className='card mb-3'
      style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
    >
      <div className='card-body'>
        {title && <h5 className='card-title'>{title}</h5>}

        <div>{children}</div>

        <div className='d-flex justify-content-end mt-2'>
          {onEdit && (
            <button className='btn btn-sm btn-secondary mx-2' onClick={onEdit}>
              Edit
            </button>
          )}
          {onDelete && (
            <button className='btn btn-sm btn-danger' onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableCard;
