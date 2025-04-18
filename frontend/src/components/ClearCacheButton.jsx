import React, { useState } from "react";
import { clearCache } from "../utils/base/apiUtil";

const ClearCacheButton = ({ onSuccess, onError }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearCache();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
      console.error("Error clearing cache:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className='btn btn-outline-danger'
      disabled={isClearing}
    >
      {isClearing ? "Clearing Cache..." : "Clear Cache"}
    </button>
  );
};

export default ClearCacheButton;
