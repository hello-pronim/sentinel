import axios from "axios";

import { userSignOut } from "../services/AuthService";

const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      userSignOut();
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
