import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
// Add a request interceptor to include the token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // adjust if you store token elsewhere
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
