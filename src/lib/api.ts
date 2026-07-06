import axios from "axios";
import { useAdminStore } from "@/store/useAdminStore";

// In dev, Vite's proxy forwards "/api" to localhost:4000 (see vite.config.ts).
// In production, the frontend (e.g. Netlify) and backend (e.g. Render) live on
// different domains, so a relative "/api" path would resolve against the
// frontend's own domain and 404. Set VITE_API_URL to your deployed backend's
// full URL (e.g. https://your-app.onrender.com) in Netlify's environment
// variables to fix this.
const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

if (import.meta.env.PROD && !API_ORIGIN) {
  console.warn(
    "[Comfort Taxi] VITE_API_URL is not set. If your frontend and backend are on different domains " +
      "(e.g. Netlify + Render), API calls will fail. Set VITE_API_URL to your backend's URL as a build " +
      "environment variable."
  );
}

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 30000,
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
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAdminStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export function assetUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Uploaded files (images/receipts) are served by the backend, not the
  // frontend, so they need the same origin prefix as API calls do.
  return `${API_ORIGIN}${path}`;
}
