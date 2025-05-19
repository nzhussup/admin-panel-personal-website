import axios from "axios";
import config from "../../config/ConfigVariables";

const fetchData = async (endpoint, setData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${config.apiUrl}/${endpoint}`);
    setData(response.data);
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching data from ${endpoint}:`, error.response);
      throw error;
    } else {
      console.error(`Unexpected error fetching data from ${endpoint}:`, error);
      throw new Error("An unexpected error occurred while fetching data.");
    }
  }
};

const clearCache = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.delete(`${config.apiUrl}/album/cache`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Cache cleared successfully.");
  } catch (error) {
    console.error("Error clearing cache:", error);
    throw error;
  }
};

export { fetchData, clearCache };
