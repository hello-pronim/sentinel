import axios from "../utils/axios";

const getMarkets = () => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/v2/marketplaces`
  );
};

export { getMarkets };
