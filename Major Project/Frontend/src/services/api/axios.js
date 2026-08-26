import axios from "axios";
import { API_BASE_URL } from "../../config/api.config";
import { store } from "../../store";
import { setAccessToken, logout } from "../../store/auth/auth.store";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send refreshToken httpOnly cookie
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject, original }));
      }
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        store.dispatch(setAccessToken(data.data.accessToken));
        queue.forEach(({ resolve, original: o }) => {
          o.headers.Authorization = `Bearer ${data.data.accessToken}`;
          resolve(api(o));
        });
        queue = [];
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        queue.forEach(({ reject }) => reject(refreshErr));
        queue = [];
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
