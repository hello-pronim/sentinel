import axios from "../utils/axios";

import {
  mockBrandsMAPTableData,
  mockCurrentViolationsTableData,
} from "./mocks";

const getBrandsMAPData = (paramsString) => {
  return Promise.resolve(mockBrandsMAPTableData);
};

const getCurrentViolationsData = (paramsString) => {
  return Promise.resolve(mockCurrentViolationsTableData);
};

export { getBrandsMAPData, getCurrentViolationsData };
