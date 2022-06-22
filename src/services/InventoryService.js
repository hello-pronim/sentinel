import axios from "../utils/axios";

const getShippedChartData = (paramsString) => {
  return axios.get(
    `/api/${process.env.REACT_APP_API_ENV || "dev"}/inventory${paramsString}`
  );
};

const getShippedTableData = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/inventory/brands${paramsString}`
  );
};

const getUntisShippedExport = (paramsString) => {
  return axios.get(
    `/api/${
      process.env.REACT_APP_API_ENV || "dev"
    }/inventory/products/export${paramsString}`
  );
};

export { getShippedChartData, getShippedTableData, getUntisShippedExport };
