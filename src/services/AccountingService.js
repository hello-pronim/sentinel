import axios from "../utils/axios";

const getAccountingData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/accounting${paramsString}`
  );
};

export { getAccountingData };
