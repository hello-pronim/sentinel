import axios from "axios";

const getCompanies = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/dev/companies")
      .then((res) => {
        const { data } = res.data.body;
        return resolve(data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export { getCompanies };
