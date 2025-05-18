import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const DEFAULT_REQUEST_TIMEOUT = 15000;

export const apiNoAuth = axios.create({
  baseURL: backendUrl,
  timeout: DEFAULT_REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

