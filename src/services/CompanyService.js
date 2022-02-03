import SecureAxios from "./SecureAxios";

const getCompanies = () => {
  return SecureAxios.get(`/api/${process.env.API_BASE_URL | "dev"}/companies`);
};

export { getCompanies };
