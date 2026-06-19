import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function isValidJwtToken(token) {
  return typeof token === "string" && token.startsWith("eyJ") && token.split(".").length === 3;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// REQUEST interceptor — attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (isValidJwtToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE interceptor — only force logout when a sent token was rejected
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(error.config?.headers?.Authorization);
    const isAuthRoute = error.config?.url?.includes("/auth/");

    if (!isAuthRoute && hadToken && status === 401) {
      console.warn("Token invalid or expired. Logging out...");
      localStorage.removeItem("jwt_token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
