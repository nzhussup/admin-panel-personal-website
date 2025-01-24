import React from "react";
import PageWrapper from "../../utils/SmoothPage";

const Loading = () => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <div
          className='spinner-border'
          role='status'
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className='sr-only'></span>
        </div>
        <h2 style={{ marginTop: "20px" }}>Loading</h2>
        <p>Please wait...</p>
      </div>
    </PageWrapper>
  );
};

export default Loading;
