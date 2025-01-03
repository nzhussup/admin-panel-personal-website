import { useState, useEffect } from "react";
import { fetchData, saveData, deleteData } from "./apiUtil";

export const usePageData = (endpoint, sortBy = "displayOrder") => {
  const [items, setItems] = useState([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchItems = async () => {
    await fetchData(endpoint, (fetchedItems) => {
      const sortedItems = [...fetchedItems].sort((a, b) =>
        isAscending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
      );
      setItems(sortedItems);
    });
  };

  const saveItem = async (formData, isEditMode) => {
    await saveData(endpoint, formData, isEditMode);
    fetchItems();
  };

  const confirmDelete = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId) {
      await deleteData(endpoint, selectedItemId);
      setSelectedItemId(null);
      setDeleteModalOpen(false);
      fetchItems();
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
