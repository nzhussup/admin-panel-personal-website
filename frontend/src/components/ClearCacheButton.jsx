import React, { useState } from "react";
import { clearCache } from "../utils/base/apiUtil";

const ClearCacheButton = ({ triggerAlertHandler }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearCache();
      triggerAlertHandler(null);
    } catch (error) {
      triggerAlertHandler(error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className='btn btn-outline-danger'
      disabled={isClearing}
      data-testid='clear-cache-button'
    >
      {isClearing ? "Clearing Cache..." : "Clear Cache"}
    </button>
  );
};

export default ClearCacheButton;
