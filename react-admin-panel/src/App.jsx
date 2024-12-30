import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
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
