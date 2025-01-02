import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import config from "../../config/ConfigVariables";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(config.authUrl, {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, expiration } = response.data;

        if (token && expiration) {
          login(token, expiration);
          console.log("Login successful!");
          navigate("/", { replace: true });
        } else {
          throw new Error("Invalid token or expiration data");
        }
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='d-flex align-items-center py-4 bg-body-tertiary vh-100'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-4'>
            <main className='form-signin w-100 m-auto'>
              <form onSubmit={handleSubmit}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='57'
                  height='57'
                  fill='currentColor'
                  className='bi bi-box-arrow-in-right'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    d='M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z'
                  />
                  <path
                    fillRule='evenodd'
                    d='M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z'
                  />
                </svg>
                <h1 className='h3 mb-3 fw-normal'>Please sign in</h1>

                {error && <div className='alert alert-danger'>{error}</div>}

                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    id='floatingInput'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label htmlFor='floatingInput'>Username</label>
                </div>

                <div className='form-floating mb-3'>
                  <input
                    type='password'
                    className='form-control'
                    id='floatingPassword'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor='floatingPassword'>Password</label>
                </div>

                <button className='btn btn-primary w-100 py-2' type='submit'>
                  Sign in
                </button>
                <p className='mt-5 mb-3 text-body-secondary'>
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
