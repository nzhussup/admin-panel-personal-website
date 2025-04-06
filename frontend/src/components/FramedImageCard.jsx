import React from "react";
import { X } from "lucide-react";

const FramedImageCard = ({ imageUrl, alt, onDelete }) => {
  return (
    <div className='position-relative w-100 ratio ratio-1x1 rounded-3 border shadow-sm overflow-hidden bg-white'>
      <img
        src={imageUrl}
        alt={alt || "Framed image"}
        className='w-100 h-100 object-fit-cover'
        loading='lazy'
      />

      <button
        onClick={onDelete}
        className='btn btn-sm position-absolute top-0 end-0 m-2 p-0 d-flex align-items-center justify-content-center'
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          zIndex: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        aria-label='Delete image'
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default FramedImageCard;
