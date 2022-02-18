import axios from "../utils/axios";

const getCompanies = () => {
  return axios.get(`/api/${process.env.REACT_APP_API_ENV || "dev"}/companies`);
};

export { getCompanies };
