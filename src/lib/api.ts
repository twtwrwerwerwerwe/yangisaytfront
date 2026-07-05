import axios from "axios";
import { useAdminStore } from "@/store/useAdminStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = useAdminStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export function assetUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  return `${apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export default api;