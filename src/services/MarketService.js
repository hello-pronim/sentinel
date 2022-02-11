import axios from "../utils/axios";

const getMarkets = () => {
  return axios.get("/api/dev/v2/marketplaces");
};

export { getMarkets };
