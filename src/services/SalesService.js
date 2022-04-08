import axios from "../utils/axios";

const getSales = (paramsString) => {
  console.log(
    axios.get(
      `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales${paramsString}`
    )
  );
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales${paramsString}`
  );
};

const getSalesData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/sales/data${paramsString}`
  );
};

export { getSales, getSalesData };
