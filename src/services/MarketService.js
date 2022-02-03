import SecureAxios from "./SecureAxios";

const getMarkets = () => {
  return SecureAxios.get("/api/dev/v2/marketplaces");
};

export { getMarkets };
