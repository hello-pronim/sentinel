import axios from "axios";

const getMarkets = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/api/dev/marketplaces")
      .then((res) => {
        const { data } = res.data.body;
        return resolve(data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export { getMarkets };
