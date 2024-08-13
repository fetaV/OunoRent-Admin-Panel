import axios from "axios";

const api = axios.create({
  baseURL: "http://10.10.3.181:5244/api",
});

let authToken = null;

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const setAuthToken = (token) => {
  authToken = token;
};

export default api;
