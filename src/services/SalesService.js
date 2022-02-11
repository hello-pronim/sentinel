import axios from "../utils/axios";

const getSales = (paramsString) => {
  return axios.get(`/api/dev/sales${paramsString}`);
};

const getSalesData = (paramsString) => {
  return axios.get(`/api/dev/sales/data${paramsString}`);
};

export { getSales, getSalesData };
