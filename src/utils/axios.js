import axios from "axios";

axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  "Access-Control-Allow-Origin": "*",
};

axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axios;
