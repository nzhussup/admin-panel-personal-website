import React from "react";
import PageWrapper from "../../../utils/SmoothPage";

const NotFound = () => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for does not exist.</p>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
