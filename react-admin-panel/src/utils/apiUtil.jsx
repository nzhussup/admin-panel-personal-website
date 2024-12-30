import axios from "axios";

const fetchData = async (endpoint, setData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `http://localhost:8080/api/v1/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data); // Use dynamic data setting
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
  }
};

const saveData = async (endpoint, formData, isEditMode) => {
  const token = localStorage.getItem("token");

  try {
    if (isEditMode) {
      await axios.put(`http://localhost:8080/api/v1/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(`http://localhost:8080/api/v1/${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // Assuming fetchData is called to refresh data after save
  } catch (error) {
    console.error(`Error saving data to ${endpoint}:`, error);
  }
};

const deleteData = async (endpoint, id) => {
  const token = localStorage.getItem("token");

  try {
    await axios.delete(`http://localhost:8080/api/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id },
    });
    // Assuming fetchData is called to refresh data after deletion
  } catch (error) {
    console.error(`Error deleting data from ${endpoint}:`, error);
  }
};

export { fetchData, saveData, deleteData };
