import axios from "../utils/axios";

const getSales = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales${paramsString}`
  );
};

const getSalesData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/data${paramsString}`
  );
};

const getSalesExport = (file_type, paramsString) => {
  const params = file_type + paramsString;
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/export/${params}`
  );
};

export { getSales, getSalesData, getSalesExport };
