import axios from "axios";
import config from "../config/ConfigVariables";

const fetchData = async (endpoint, setData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(response.data);
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
  }
};

const saveData = async (endpoint, formData, isEditMode) => {
  const token = localStorage.getItem("token");

  try {
    if (isEditMode) {
      await axios.put(`${config.apiUrl}/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(`${config.apiUrl}/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error(`Error saving data to ${endpoint}:`, error);
  }
};

const deleteData = async (endpoint, id) => {
  const token = localStorage.getItem("token");

  try {
    await axios.delete(`${config.apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id },
    });
  } catch (error) {
    console.error(`Error deleting data from ${endpoint}:`, error);
  }
};

const clearCache = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `${config.apiUrl}/cache/clearGlobalCache`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Cache cleared successfully.");
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

export { fetchData, saveData, deleteData, clearCache };
