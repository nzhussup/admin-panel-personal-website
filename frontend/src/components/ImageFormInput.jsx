import React, { useState } from "react";

const ImageFormInput = ({
  label,
  value,
  onChange,
  required = false,
  multiple = true,
}) => {
  const [previewImages, setPreviewImages] = useState(value || []);

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);

    const readFiles = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve({ file, preview: reader.result });
        };
      });
    });

    const results = await Promise.all(readFiles);
    const updatedPreviews = [...previewImages, ...results];
    setPreviewImages(updatedPreviews);
    onChange(updatedPreviews);
  };

  const removeImagePreview = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    onChange(updatedPreviews);
  };

  return (
    <div className='mb-4'>
      {label && <label className='form-label'>{label}</label>}

      <input
        type='file'
        id='image-upload-input'
        style={{ display: "none" }}
        accept='image/*'
        multiple={multiple}
        onChange={handleFileInputChange}
        required={required}
      />
      <label htmlFor='image-upload-input' className='btn btn-primary btn-sm'>
        Select Image{multiple && "s"}
      </label>

      {previewImages.length > 0 && (
        <div className='d-flex flex-wrap gap-2 mt-3'>
          {previewImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "80px",
                height: "80px",
              }}
            >
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type='button'
                onClick={() => removeImagePreview(index)}
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageFormInput;
