import axios from "../utils/axios";

const getDailySalesExport = (file_type, paramsString) => {
  const params = file_type + paramsString;
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/export/${params}`
  );
};

const getDataSources = () => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/audit/sales`
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

const getSalesByListingExport = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/sales/products/export${paramsString}`
  );
};

const getSalesData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/data${paramsString}`
  );
};

const getSalesPerformance = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/sales/performance${paramsString}`
  );
};
export {
  getDailySalesExport,
  getDataSources,
  getSales,
  getSalesByCompany,
  getSalesByListingExport,
  getSalesData,
  getSalesPerformance,
};
