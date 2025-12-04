import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;