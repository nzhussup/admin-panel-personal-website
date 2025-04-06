import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import ClearCacheButton from "./ClearCacheButton";
import GlobalAlert from "./GlobalAlert"; // Import GlobalAlert component

const Header = ({ text }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("alert-success");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleClearCacheSuccess = () => {
    setAlertMessage("Cache cleared successfully!");
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleClearCacheError = (error) => {
    setAlertType("alert-danger");
    setAlertMessage(error.message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  return (
    <div className='container'>
      <header className='py-3 mb-4 border-bottom'>
        <div className='row align-items-center'>
          {/* Logo on the left */}
          <div className='col-12 col-md-4 text-center text-md-start mb-2 mb-md-0'>
            <a
              href='/'
              className='d-inline-flex link-body-emphasis text-decoration-none'
              onClick={handleLogoClick}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='40'
                height='40'
                fill='currentColor'
                className='bi bi-code-slash'
                viewBox='0 0 16 16'
              >
                <path d='M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0' />
              </svg>
            </a>
          </div>

          {/* Title in the middle */}
          <div className='col-12 col-md-4 text-center mb-2 mb-md-0'>
            <h1 className='h4'>{text}</h1>
          </div>

          {/* Buttons on the right */}
          <div className='col-12 col-md-4 d-flex justify-content-center justify-content-md-end align-items-center'>
            {/* On mobile, stack components vertically */}
            <div className='d-flex flex-column flex-md-row align-items-center w-100'>
              {/* Dark Mode Toggle & Clear Cache Button */}
              <div className='d-flex justify-content-center align-items-center mb-3 mb-md-0 me-md-3'>
                <label className='form-check form-switch me-2'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <span className='form-check-label'>
                    {isDarkMode ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='black'
                        className='bi bi-moon-stars'
                        viewBox='0 0 16 16'
                      >
                        <path d='...' />
                      </svg>
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-brightness-high'
                        viewBox='0 0 16 16'
                      >
                        <path d='...' />
                      </svg>
                    )}
                  </span>
                </label>
                <ClearCacheButton
                  onSuccess={handleClearCacheSuccess}
                  onError={handleClearCacheError}
                />
              </div>

              <button
                type='button'
                className='btn btn-outline-primary'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Alert */}
      <GlobalAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        type={alertType}
      />
    </div>
  );
};

export default Header;
