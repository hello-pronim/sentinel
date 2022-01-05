import SecureAxios from "./SecureAxios";

const getCompanies = () => {
  return SecureAxios.get("/api/dev/companies");
};

export { getCompanies };
