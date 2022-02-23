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
        resolve(session);
      }
    });
  });
};

const userSignOut = () => {
  return new Promise((resolve, reject) => {
    try {
      const user = UserPool.getCurrentUser();

      if (user) user.signOut();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export { getRefreshToken, refreshToken, userSignOut };
