import axios from "../utils/axios";

const getAdminBrands = () => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/admin/companies`
  );
};

export { getAdminBrands };
