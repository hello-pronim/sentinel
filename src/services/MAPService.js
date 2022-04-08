import axios from "../utils/axios";

import {
  mockBrandsMAPTableData,
  mockCurrentViolationsTableData,
} from "./mocks";

const getMAPOveralls = () => {
  return axios.get(`/api/${process.env.REACT_APP_API_ENV || "dev"}/map`);
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

export { getMAPOveralls, getBrandsMAPData, getCurrentViolationsData };
