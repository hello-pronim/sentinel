import SecureAxios from "./SecureAxios";

const getSales = (paramsString) => {
  return SecureAxios.get("/api" + process.env.API_BASE_URL | "dev" + "/sales" + paramsString);
};

const getSalesData = (paramsString) => {
  return SecureAxios.get("/api" + process.env.API_BASE_URL | "dev" + "/sales/data" + paramsString);
};

export { getSales, getSalesData };
