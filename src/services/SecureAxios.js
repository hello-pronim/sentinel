import axios from "../utils/axios";

class SecureAxios {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/${process.env.REACT_APP_API_ENV || "dev"}${url}`, params)
        .then((res) => {
          const { data } = res.data.body;
          return resolve(data);
        })
        .catch((err) => {
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

    token =
      "eyJraWQiOiJcL2o1eWt6UTZyVjIrTHBuSjJiOWtYTnYwc3BuQktZSnVJR2dsRUxCODZnUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzYTU5YTk2ZC02ZWIyLTQ0MTUtOGYxZi00OWVmMmRkZGNjMzciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfenp5Q2NXcEtaIiwiY29nbml0bzp1c2VybmFtZSI6InByeW1za2l3ZW4iLCJvcmlnaW5fanRpIjoiYjk4OGIzNDItOGY2Ny00MmFlLTlhZmQtODg4ODk2YjNjZTIxIiwiYXVkIjoiMjVkbTM0aDY5cDllYmwwY245bnRuaTNvbmUiLCJldmVudF9pZCI6IjJjMTE4OTJhLTRmZWQtNDlhMS1hYTUxLThmYjk5ZTE5MmMxYiIsInVwZGF0ZWRfYXQiOjE2NDE0ODU5OTMsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQyOTgyNjc5LCJuYW1lIjoicHJ5bXNraXdlbkBnbWFpbC5jb20iLCJleHAiOjE2NDQ0Mjg2NTQsImlhdCI6MTY0NDQyNTA1NCwianRpIjoiOTI2MGM5MWEtODQ4Mi00NWQxLTg5NmUtNzQ3MWMwNWVmMzg1IiwiZW1haWwiOiJwcnltc2tpd2VuQGdtYWlsLmNvbSJ9.EaSWGrUnT4R--xlvdCOVaLVGBilYUcoQSc8aNbxo0rO6NCu4kebdovLirNSEgpxGNo9O1aGbgHHI8GOHErNvU6veXP0eDXIThU21H682cvSTzFrOgqslsMPKwjOQPQiHPsxQ6xiqLbsQZ34UPOP25Iu4EOaN_IOL5bgIE07kPzEjTOOk6nAfqIy3Nxl1LDFwy4LDZKlzPYjWoq1hG36V70VPaw-jjNvo1idWjAuEsqjnXo3fRwAz-5pKv0S3TX2PiQyceeGlTAxylShKy2zeON4ibE1_UyzJhSKFAVpTqB1_UXAZ-TpVditCvtNypAc8_PnJlMi9mN0i_WuKVqvYsQ";

    return token;
  }
}

export default new SecureAxios();
