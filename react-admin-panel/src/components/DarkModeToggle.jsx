import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className='form-check form-switch'>
      <input
        className='form-check-input'
        type='checkbox'
        id='darkModeSwitch'
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <label className='form-check-label' htmlFor='darkModeSwitch'>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </label>
    </div>
  );
};

export default DarkModeToggle;
