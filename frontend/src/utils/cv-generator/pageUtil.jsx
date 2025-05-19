import { useState, useEffect } from "react";
import { fetchData } from "./apiUtil";
import config from "../../config/ConfigVariables";

export const usePageData = (sortBy = "displayOrder") => {
  const [items, setItems] = useState([]);
  const [isAscending, setIsAscending] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchItems = async () => {
    const loadingTimeout = setTimeout(() => {
      setShowLoading(true);
    }, config.showLoadingDelay);

    setError(null);
    try {
      let result = [];
      for (const [key, endpoint] of Object.entries(config.endpoints.base)) {
        await fetchData(endpoint, (fetchedItems) => {
          const sortedItems = [...fetchedItems].sort((a, b) =>
            isAscending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
          );
          result.push({ [key]: sortedItems });
        });
      }
      setItems(result);
    } catch (error) {
      setError(error);
    } finally {
      clearTimeout(loadingTimeout);
      setShowLoading(false);
    }
  };

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    fetchItems();
  }, [isAscending]);

  return {
    items,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  };
};

export const useRenderPage = (
  items,
  showLoading,
  error,
  delay = config.showNoInfoDelay
) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (items.length <= 0) {
      const timeout = setTimeout(() => setDelayed(true), delay);
      return () => clearTimeout(timeout);
    } else {
      setDelayed(false);
    }
  }, [items, delay]);

  const renderPage = (
    ErrorElement,
    LoadingElement,
    NoInfoFoundElement,
    itemPage
  ) => {
    if (showLoading) return <LoadingElement />;
    if (error) return <ErrorElement {...error} />;
    if (items.length <= 0 && delayed) return <NoInfoFoundElement />;
    return itemPage;
  };

  return { renderPage };
};
