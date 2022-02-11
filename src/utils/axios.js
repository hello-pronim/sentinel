import axios from "axios";

import { getRefreshToken, refreshToken } from "../services/AuthService";

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.response.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      const token = await getRefreshToken();

      if (token) await refreshToken(token);

      originalRequest._retry = true;

      return axiosApiInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosApiInstance;
