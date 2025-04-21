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
  const isDate = type === "date";

  return (
    <div className='mb-3 position-relative'>
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
        <>
          <input
            type={type}
            className='form-control pe-5'
            value={value}
            onChange={onChange}
            required={required}
          />
          {/* Show clear button only for date inputs with a value */}
          {isDate && value && (
            <button
              type='button'
              onClick={() => onChange({ target: { value: "" } })}
              className='btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2'
              style={{ zIndex: 10 }}
            >
              &times;
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FormInput;
