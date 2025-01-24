import React from "react";
import PageWrapper from "../../../utils/SmoothPage";
import { desc } from "framer-motion/client";

const InternalServerError = ({ description }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>500 - Internal Server Error</h1>
        <p>{description}</p>
      </div>
    </PageWrapper>
  );
};

export default InternalServerError;
