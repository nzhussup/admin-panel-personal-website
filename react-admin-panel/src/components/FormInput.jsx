import React from "react";

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  rows = 3,
}) => {
  return (
    <div className='mb-3'>
      <label className='form-label'>{label}</label>
      {type === "textarea" ? (
        <textarea
          className='form-control'
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          className='form-control'
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default FormInput;
