import React from "react";
import { X } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useGlobalAlert } from "../context/GlobalAlertContext";

const FramedImageCard = ({ imageUrl, alt, onDelete, onEdit }) => {
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

  const imageId = imageUrl?.split("/").pop();

  return (
    <>
      <div
        className={`position-relative rounded-3 overflow-hidden image-frame ${
          isDarkMode ? "dark-mode" : ""
        }`}
        onClick={handleCopyUrl}
        style={{
          cursor: "pointer",
          border: isDarkMode ? "1px solid #444" : "1px solid #ddd",
          backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          width: "100%",
          paddingTop: "100%", // maintain 1:1 aspect ratio
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        <div
          className='position-absolute top-0 start-0 w-100 h-100'
          style={{ overflow: "hidden", borderRadius: "12px" }}
        >
          <img
            src={imageUrl}
            alt={alt || "Framed image"}
            className='w-100 h-100 object-fit-cover image-frame-img'
            loading='lazy'
            style={{
              transition: "transform 0.3s ease, filter 0.3s ease",
            }}
          />

          {/* Delete Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <X size={18} />
          </button>

          {/* Edit Button - Top Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            Edit
          </button>

          {imageId && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                zIndex: 5,
              }}
            >
              {imageId}
            </div>
          )}

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
      </div>
    </>
  );
};

export default FramedImageCard;
