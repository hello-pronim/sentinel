import axios from "axios";

class CompanyService {
  getCompanies() {
    return axios.get("/dev/companies");
  }
}

export default new CompanyService();
