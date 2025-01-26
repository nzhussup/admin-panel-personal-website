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
    throw new Error(`Error fetching data from ${endpoint}: ${error}`);
  }
};

const saveData = async (endpoint, formData, isEditMode) => {
  const token = localStorage.getItem("token");

  try {
    let response;
    if (isEditMode) {
      response = await axios.put(`${config.apiUrl}/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await axios.post(`${config.apiUrl}/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response;
  } catch (error) {
    if (error.response) {
      console.error(`Error saving data to ${endpoint}:`, error.response);
      return error.response;
    } else {
      console.error(`Unexpected error saving data to ${endpoint}:`, error);
      throw new Error("An unexpected error occurred while saving data.");
    }
  }
};

const deleteData = async (endpoint, id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${config.apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id },
    });
    return response;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      console.error(`Error deleting data from ${endpoint}:`, error);
      throw new Error("An unexpected error occurred while deleting data.");
    }
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
