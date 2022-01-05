import SecureAxios from "./SecureAxios";

const getMarkets = () => {
  return SecureAxios.get("/api/dev/marketplaces");
};

export { getMarkets };
