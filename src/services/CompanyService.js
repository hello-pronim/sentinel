import SecureAxios from "./SecureAxios";

const getCompanies = () => {
  return SecureAxios.get("/companies");
};

export { getCompanies };
