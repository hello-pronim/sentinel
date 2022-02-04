import SecureAxios from "./SecureAxios";

const getMarkets = () => {
  return SecureAxios.get("/v2/marketplaces");
};

export { getMarkets };
