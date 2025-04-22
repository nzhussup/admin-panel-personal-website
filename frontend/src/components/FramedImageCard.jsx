import React from "react";
import { X } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useGlobalAlert } from "../context/GlobalAlertContext";

const FramedImageCard = ({ imageUrl, alt, onDelete }) => {
  const { isDarkMode } = useDarkMode();
  const { triggerAlert } = useGlobalAlert();

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(imageUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = imageUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      triggerAlert("Image URL copied to clipboard!", "success");
    } catch (err) {
      console.error("Copy failed:", err);
      triggerAlert("Failed to copy image URL.", "danger");
    }
  };

  return (
    <>
      <div
        className={`position-relative ratio ratio-1x1 rounded-3 overflow-hidden image-frame ${
          isDarkMode ? "dark-mode" : ""
        }`}
        onClick={handleCopyUrl}
        style={{
          cursor: "pointer",
          border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        <img
          src={imageUrl}
          alt={alt || "Framed image"}
          className='w-100 h-100 object-fit-cover image-frame-img'
          loading='lazy'
          style={{
            borderRadius: "12px",
            transition: "transform 0.3s ease, filter 0.3s ease",
          }}
        />

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent copy when delete is clicked
            onDelete?.();
          }}
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

        <style>{`
        .image-frame:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .image-frame:hover .image-frame-img {
          transform: scale(1.05);
          filter: brightness(1.08);
        }

        .dark-mode .image-frame:hover .image-frame-img {
          filter: brightness(1.12);
        }

        .dark-mode .image-frame {
          background-color: #1f1f1f;
        }
      `}</style>
      </div>
    </>
  );
};

export default FramedImageCard;
