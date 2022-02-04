import SecureAxios from "./SecureAxios";

const getSales = (paramsString) => {
  return SecureAxios.get(`/sales${paramsString}`);
};

const getSalesData = (paramsString) => {
  return SecureAxios.get(`/sales/data${paramsString}`);
};

export { getSales, getSalesData };
