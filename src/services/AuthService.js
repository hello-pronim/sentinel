import {
  CognitoRefreshToken,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

import { cognitoConfig } from "../config";

const UserPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId || "",
  ClientId: cognitoConfig.clientId || "",
});

const getRefreshToken = () => {
  return new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser();

    if (user) {
      user.getSession(async (err, session) => {
        if (err) {
          reject(err);
        } else {
          const token = session?.refreshToken.token;

          resolve(token);
        }
      });
    }
  });
};

const refreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser();
    const token = new CognitoRefreshToken({ RefreshToken: refreshToken });

    user.refreshSession(token, (err, session) => {
      if (err) reject(err);
      else {
        console.log(session);
        // const poolId = process.env.REACT_APP_COGNITO_CLIENT_ID;
        // const lastAuthUser = localStorage.getItem(
        //   "CognitoIdentityServiceProvider." + poolId + ".LastAuthUser"
        // );
        // localStorage.setItem(
        //   "CognitoIdentityServiceProvider." +
        //     poolId +
        //     "." +
        //     lastAuthUser +
        //     ".idToken",
        //   session.idToken.jwtToken
        // );
        // localStorage.setItem(
        //   "CognitoIdentityServiceProvider." +
        //     poolId +
        //     "." +
        //     lastAuthUser +
        //     ".accessToken",
        //   session.accessToken.jwtToken
        // );
        // localStorage.setItem(
        //   "CognitoIdentityServiceProvider." +
        //     poolId +
        //     "." +
        //     lastAuthUser +
        //     ".refreshToken",
        //   session.refreshToken.token
        // );
        // localStorage.setItem(
        //   "CognitoIdentityServiceProvider." +
        //     poolId +
        //     "." +
        //     lastAuthUser +
        //     ".clockDrift",
        //   session.clockDrift
        // );
        resolve(session);
      }
    });
  });
};

export { getRefreshToken, refreshToken };
