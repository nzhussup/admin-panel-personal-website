import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ text }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className='container'>
      <header className='d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom'>
        {/* Left Section: Logo */}
        <div className='col-4 col-md-3 mb-2 mb-md-0 text-center text-md-start'>
          <a
            href='/'
            className='d-inline-flex link-body-emphasis text-decoration-none'
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

        {/* Center Section: Title */}
        <div className='col-8 col-md-6 text-center mb-2 mb-md-0'>
          <h1 className='h4'>{text}</h1>
        </div>

        {/* Right Section: Logout Button */}
        <div className='col-12 col-md-3 text-center text-md-end'>
          <button
            type='button'
            className='btn btn-outline-primary'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
