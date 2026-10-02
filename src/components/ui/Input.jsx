import React, { useState } from 'react';

const Input = ({
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  maxLength = 50,
  required = false,
  name = '',
  label = '',
  error = '',
  className = ''
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleBlur = (e) => {
    setIsTouched(true);
    if (onBlur) onBlur(e);
  };

  const showError = isTouched && error;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}

      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        name={name}
        className={`input-field ${showError ? 'input-field--error' : ''}`}
      />

      <div className="input-footer">
        <span className="input-counter">{value.length}/{maxLength}</span>
        {showError && <span className="input-error">{error}</span>}
      </div>
    </div>
  );
};

export default Input;