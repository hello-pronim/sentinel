import SecureAxios from "./SecureAxios";

const getSales = (paramsString) => {
  return SecureAxios.get("/api/sales" + paramsString);
};

const getSalesData = (paramsString) => {
  return SecureAxios.get("/api/sales/data" + paramsString);
};

export { getSales, getSalesData };
