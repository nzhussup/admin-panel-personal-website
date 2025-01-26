import { useState, useEffect } from "react";
import { fetchData, saveData, deleteData } from "./apiUtil";
import config from "../config/ConfigVariables";

export const usePageData = (endpoint, sortBy = "displayOrder") => {
  const [items, setItems] = useState([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchItems = async () => {
    const loadingTimeout = setTimeout(() => {
      setShowLoading(true);
    }, config.showLoadingDelay);

    setError(null);
    try {
      await fetchData(endpoint, (fetchedItems) => {
        const sortedItems = [...fetchedItems].sort((a, b) =>
          isAscending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
        );
        setItems(sortedItems);
      });
    } catch (error) {
      setError(error);
    } finally {
      clearTimeout(loadingTimeout);
      setShowLoading(false);
    }
  };

  const saveItem = async (formData, isEditMode) => {
    const response = await saveData(endpoint, formData, isEditMode);
    fetchItems();
    setResponse(response);
  };

  const confirmDelete = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId) {
      try {
        const response = await deleteData(endpoint, selectedItemId);
        setSelectedItemId(null);
        setDeleteModalOpen(false);
        fetchItems();
        setResponse(response);
      } catch (error) {
        console.error("Error in handleDelete:", error);
        setError(error);
      }
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
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  };
};

export const usePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopup = (data = null) => {
    setIsEditMode(!!data);
    setFormData(data || {});
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
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
    if (error) return <ErrorElement description={error.toString()} />;
    if (items.length <= 0 && delayed) return <NoInfoFoundElement />;
    return itemPage;
  };

  return { renderPage };
};
