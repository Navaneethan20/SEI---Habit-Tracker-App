import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach access token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh logic: if 401 and refresh exists, try refresh once
let isRefreshing = false;
let pendingRequests = [];

function processQueue(error, token = null) {
  pendingRequests.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  pendingRequests = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        // No refresh -> can't recover
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // queue the request
        return new Promise(function (resolve, reject) {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalReq.headers.Authorization = "Bearer " + token;
            return api(originalReq);
          })
          .catch((e) => Promise.reject(e));
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const resp = await axios.post(`${API_BASE}/auth/token/refresh/`, {
          refresh,
        });
        const access = resp.data.access;
        localStorage.setItem("access_token", access);
        api.defaults.headers.common.Authorization = "Bearer " + access;
        processQueue(null, access);
        return api(originalReq);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // logout locally
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
