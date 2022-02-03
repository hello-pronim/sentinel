import SecureAxios from "./SecureAxios";

const getMarkets = () => {
  return SecureAxios.get("/api" + process.env.API_BASE_URL | "dev" + "/v2/marketplaces");
};

export { getMarkets };
