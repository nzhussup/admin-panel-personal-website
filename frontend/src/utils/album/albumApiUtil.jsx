import axios from "axios";
import config from "../../config/ConfigVariables";

const fetchData = async (endpoint, setData, queryParam) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: queryParam || {},
    });
    setData(response.data);
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching data from ${endpoint}:`, error.response);
      throw error;
    }
    console.error(`Unexpected error fetching data from ${endpoint}:`, error);
    throw new Error("An unexpected error occurred while fetching data.");
  }
};

const saveData = async (endpoint, formData, isEditMode) => {
  const token = localStorage.getItem("token");

  try {
    let response;
    if (isEditMode) {
      response = await axios.put(
        `${config.apiUrl}/${endpoint}/${formData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      throw error;
    }
    console.error(`Unexpected error saving data to ${endpoint}:`, error);
    throw new Error("An unexpected error occurred while saving data.");
  }
};

const saveImageData = async (endpoint, formData) => {
  const token = localStorage.getItem("token");

  const data = new FormData();
  if (formData.file && Array.isArray(formData.file)) {
    formData.file.forEach((item, index) => {
      data.append("file", item.file);
    });
  }

  try {
    const response = await axios.post(`${config.apiUrl}/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error uploading image(s):", error);
    throw error;
  }
};
const deleteData = async (endpoint, id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.delete(`${config.apiUrl}/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id },
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      console.error(`Error deleting data from ${endpoint}:`, error);
      throw new Error("An unexpected error occurred while deleting data.");
    }
  }
};

// const clearCache = async () => {
//   const token = localStorage.getItem("token");

//   try {
//     await axios.post(
//       `${config.apiUrl}/cache/clearGlobalCache`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("Cache cleared successfully.");
//   } catch (error) {
//     console.error("Error clearing cache:", error);
//   }
// };

export { fetchData, saveData, saveImageData, deleteData };
