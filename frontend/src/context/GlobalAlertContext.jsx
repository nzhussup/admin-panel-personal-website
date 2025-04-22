import React, { createContext, useContext, useState, useCallback } from "react";

const GlobalAlertContext = createContext();

export const GlobalAlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "alert-success",
  });

  const triggerAlert = useCallback((message, type = "success") => {
    setAlert({ show: false, message: "", type });
    setTimeout(() => {
      setAlert({ show: true, message, type });
    }, 10);
  }, []);

  const closeAlert = () => setAlert((prev) => ({ ...prev, show: false }));

  return (
    <GlobalAlertContext.Provider value={{ alert, triggerAlert, closeAlert }}>
      {children}
    </GlobalAlertContext.Provider>
  );
};

export const useGlobalAlert = () => useContext(GlobalAlertContext);
