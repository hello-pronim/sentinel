import axios from "../utils/axios";

class SecureAxios {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/${process.env.REACT_APP_API_ENV || "dev"}${url}`, {
          ...params,
          headers: { Authorization: "Bearer " + this.getToken() },
        })
        .then((res) => {
          const { data } = res.data.body;
          return resolve(data);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  post(url, payload = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, payload, {
          headers: { Authorization: "Bearer " + this.getToken() },
        })
        .then((res) => {
          const { data } = res.data.body;
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  patch(url, payload = {}) {
    return new Promise((resolve, reject) => {
      axios
        .patch(url, payload, {
          headers: { Authorization: "Bearer " + this.getToken() },
        })
        .then((res) => {
          const { data } = res.data.body;
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  delete(url) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, {
          headers: { Authorization: "Bearer " + this.getToken() },
        })
        .then((res) => {
          const { data } = res.data;
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  getToken() {
    let poolId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    let lastAuthUser = localStorage.getItem(
      "CognitoIdentityServiceProvider." + poolId + ".LastAuthUser"
    );
    let token = localStorage.getItem(
      "CognitoIdentityServiceProvider." +
        poolId +
        "." +
        lastAuthUser +
        ".idToken"
    );

    return token;
  }
}

export default new SecureAxios();
