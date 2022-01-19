import SecureAxios from "./SecureAxios";

const getSales = (params) => {
  return SecureAxios.get("/api/dev/sales", params);
};

const getSalesData = (params) => {
  return SecureAxios.get("/api/dev/sales/data", params);
};

export { getSales, getSalesData };
