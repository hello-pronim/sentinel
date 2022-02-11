import axios from "../utils/axios";

const getCompanies = () => {
  return axios.get("/api/dev/companies");
};

export { getCompanies };
