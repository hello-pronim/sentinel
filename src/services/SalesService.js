import SecureAxios from "./SecureAxios";

const getSales = (params) => {
  return SecureAxios.get("/api/dev/sales", params);
};

export { getSales };
