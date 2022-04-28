import axios from "../utils/axios";

const getSalesPerformance = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/sales/performance${paramsString}`
  );
};

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

const getSalesExport = (file_type) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/export/${file_type}`
  );
};

export { getSalesPerformance, getSales, getSalesData, getSalesExport };
