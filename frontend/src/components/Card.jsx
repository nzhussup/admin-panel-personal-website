import React from "react";

const Card = ({ title, desc, img, buttontxt, handleFunc }) => {
  return (
    <div
      className='card shadow-sm border-0 rounded-4 overflow-hidden card-hover transition'
      onClick={handleFunc ? () => handleFunc() : null}
      style={{
        cursor: handleFunc ? "pointer" : "default",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {img && (
        <img
          src={img}
          className='card-img-top'
          alt={title}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <div className='card-body'>
        {title && <h5 className='card-title fw-semibold'>{title}</h5>}
        {desc && (
          <p className='card-text text-secondary' style={{ opacity: 0.85 }}>
            {desc}
          </p>
        )}
        {buttontxt && (
          <button
            className='btn btn-sm btn-outline-primary mt-2'
            onClick={(e) => {
              e.stopPropagation();
              handleFunc?.();
            }}
          >
            {buttontxt}
          </button>
        )}
      </div>

      <style>{`
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
};

export default Card;
