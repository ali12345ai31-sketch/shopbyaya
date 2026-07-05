import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/shop-aya-backend/api",
  withCredentials: true,
  validateStatus: () => true
});

export default api;
