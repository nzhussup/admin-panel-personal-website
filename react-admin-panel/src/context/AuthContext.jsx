import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    token: null,
    expiration: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");

    if (token && expirationDate) {
      const expirationTime = parseInt(expirationDate, 10) * 1000;
      if (expirationTime > new Date().getTime()) {
        setState({
          isAuthenticated: true,
          token,
          expiration: expirationDate,
          loading: false,
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        setState({
          isAuthenticated: false,
          token: null,
          expiration: null,
          loading: false,
        });
      }
    } else {
      setState({
        isAuthenticated: false,
        token: null,
        expiration: null,
        loading: false,
      });
    }
  }, []);

  const login = (token, expiration) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiration);
    setState({ isAuthenticated: true, token, expiration, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    setState({
      isAuthenticated: false,
      token: null,
      expiration: null,
      loading: false,
    });
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
