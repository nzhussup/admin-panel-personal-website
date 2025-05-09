import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import config from "../../config/ConfigVariables";
import { useDarkMode } from "../../context/DarkModeContext";
import DarkModeToggle from "../../components/DarkModeToggle";
import Loading from "../misc/Loading";
import PageWrapper from "../../utils/SmoothPage";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await axios.post(config.authUrl + "/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, expiration } = response.data;

        const validateResponse = await axios.post(
          config.authUrl + "/validate",
          { token }
        );

        if (validateResponse.status === 200) {
          const { username, roles } = validateResponse.data;

          if (!roles.includes("ROLE_ADMIN")) {
            throw new Error("Only administrators can access this page.");
          }
        } else {
          throw new Error("Token is not valid.");
        }

        if (token && expiration) {
          login(token, expiration);
          console.log("Login successful!");
          navigate("/", { replace: true });
        } else {
          throw new Error("Invalid token or expiration data");
        }
      } else {
        setError("Login failed. Please try again.");
        throw new Error("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <PageWrapper>
      <div className='form-floating mb-3'>
        <input
          type='text'
          className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
          id='floatingInput'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
            color: isDarkMode ? "#e0e0e0" : "#000",
          }}
        />
        <label htmlFor='floatingInput'>Username</label>
      </div>

      <div className='form-floating mb-3'>
        <input
          type='password'
          className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
          id='floatingPassword'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
            color: isDarkMode ? "#e0e0e0" : "#000",
          }}
        />
        <label htmlFor='floatingPassword'>Password</label>
      </div>

      <button
        className={`btn w-100 py-2 ${
          isDarkMode ? "btn-secondary" : "btn-primary"
        }`}
        type='submit'
        style={{
          backgroundColor: isDarkMode ? "#505050" : "#007bff",
          color: isDarkMode ? "#e0e0e0" : "#fff",
        }}
      >
        Sign in
      </button>
    </PageWrapper>
  );

  return (
    <div
      className={`d-flex align-items-center py-4 vh-100 ${
        isDarkMode ? "dark-mode" : ""
      }`}
      style={{
        backgroundColor: isDarkMode
          ? "#121212 !important"
          : "#f8f9fa !important",
      }}
    >
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-4'>
            <main className='form-signin w-100 m-auto'>
              <form onSubmit={handleSubmit}>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <h1
                    className='h3 mb-3 fw-normal'
                    style={{
                      color: isDarkMode ? "#e0e0e0" : "#000",
                    }}
                  >
                    Please sign in
                  </h1>
                  <DarkModeToggle />
                </div>

                {error && <div className='alert alert-danger'>{error}</div>}

                {loading ? <Loading /> : loginForm}
                <p
                  className='mt-5 mb-3'
                  style={{
                    color: isDarkMode ? "#b0b0b0" : "#666",
                  }}
                >
                  © by nzhussup. All rights reserved!
                </p>
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
