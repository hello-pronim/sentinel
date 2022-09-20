import axios from "../utils/axios";

const addSellerNote = (sellerId, comment) => {
  return axios.post(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/seller/notes`,
    { seller_id: sellerId, comment }
  );
};

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

const getSellerNotes = (sellerId) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/seller/notes?seller_id=${sellerId}`
  );
};

const getSuppressionsData = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/listings/suppressed${paramsString}`
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
  addSellerNote,
  getMAPOveralls,
  getBrandsMAPData,
  getCurrentViolationsData,
  getCurrentViolationsExport,
  getSellerNotes,
  getSuppressionsData,
  updateMAPStatus,
};
