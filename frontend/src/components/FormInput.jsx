import React from "react";

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  rows = 3,
  options = [],
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
      ) : type === "select" ? (
        <select
          className='form-control'
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value='' disabled>
            Select a role
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
