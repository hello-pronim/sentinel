import SecureAxios from "./SecureAxios";

const getSales = (paramsString) => {
  return SecureAxios.get("/api/dev/sales" + paramsString);
};

const getSalesData = (paramsString) => {
  return SecureAxios.get("/api/dev/sales/data" + paramsString);
};

export { getSales, getSalesData };
