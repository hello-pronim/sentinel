import axios from "../utils/axios";

const getShipped = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/inventory${paramsString}`
  );
};

export { getShipped };
