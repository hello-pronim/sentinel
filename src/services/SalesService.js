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

const getSalesByCompany = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/sales/companies${paramsString}`
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

export {
  getSalesPerformance,
  getSales,
  getSalesByCompany,
  getSalesData,
  getSalesExport,
};
