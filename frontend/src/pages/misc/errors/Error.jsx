import React from "react";
import InternalServerError from "./InternalServerError";
import NotFound from "./NotFound";

const ErrorElement = ({ status, response }) => {
  if (status === 404) {
    return <NotFound />;
  }

  return <InternalServerError description={response} />;
};

export default ErrorElement;
