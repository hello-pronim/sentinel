import axios from "../utils/axios";

const getMAPOveralls = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/map${paramsString}`
  );
};

const getBrandsMAPData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/map/brands${paramsString}`
  );
};

const getCurrentViolationsData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/map/listings${paramsString}`
  );
};

const getCurrentViolationsExport = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/map/listings/export${paramsString}`
  );
};

const updateMAPStatus = (status, priceId) => {
  const formData = new FormData();
  formData.append("status", status);
  return axios.put(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/map/${priceId}`,
    formData
  );
};

export {
  getMAPOveralls,
  getBrandsMAPData,
  getCurrentViolationsData,
  getCurrentViolationsExport,
  updateMAPStatus,
};
