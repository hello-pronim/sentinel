import SecureAxios from "./SecureAxios";

const getMarkets = () => {
  return SecureAxios.get("/api/v2/marketplaces");
};

export { getMarkets };
