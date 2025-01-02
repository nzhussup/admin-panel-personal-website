import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./config/routes";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { DarkModeProvider, useDarkMode } from "./context/DarkModeContext";

function App() {
  return (
    <DarkModeProvider>
      <MainApp />
    </DarkModeProvider>
  );
}

function MainApp() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <Routes>
      {routes.map((route) => {
        if (route.isProtected) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          );
        }

        return (
          <Route key={route.path} path={route.path} element={route.element} />
        );
      })}
    </Routes>
  );
}

export default App;
