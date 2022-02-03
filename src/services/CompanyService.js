import SecureAxios from "./SecureAxios";

const getCompanies = () => {
  return SecureAxios.get("/api/companies");
};

export { getCompanies };
