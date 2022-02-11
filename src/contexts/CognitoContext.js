import { createContext, useCallback, useEffect, useReducer } from "react";

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

import axios from "../utils/axios";
import { cognitoConfig } from "../config";

const INITIALIZE = "INITIALIZE";
const SIGN_OUT = "SIGN_OUT";

const UserPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId || "",
  ClientId: cognitoConfig.clientId || "",
});

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === INITIALIZE) {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  if (action.type === SIGN_OUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserAttributes = useCallback(
    (currentUser) =>
      new Promise((resolve, reject) => {
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
          } else {
            const results = {};

            attributes?.forEach((attribute) => {
              results[attribute.Name] = attribute.Value;
            });
            resolve(results);
          }
        });
      }),
    []
  );

  const getSession = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser();

        if (user) {
          user.getSession(async (err, session) => {
            if (err) {
              reject(err);
            } else {
              const attributes = await getUserAttributes(user);
              const token = session?.getIdToken().getJwtToken();

              axios.defaults.headers.common.Authorization = "Bearer " + token;
              // axios.defaults.headers.common.Authroization =
              //   "Bearer eyJraWQiOiJcL2o1eWt6UTZyVjIrTHBuSjJiOWtYTnYwc3BuQktZSnVJR2dsRUxCODZnUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzYTU5YTk2ZC02ZWIyLTQ0MTUtOGYxZi00OWVmMmRkZGNjMzciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfenp5Q2NXcEtaIiwiY29nbml0bzp1c2VybmFtZSI6InByeW1za2l3ZW4iLCJvcmlnaW5fanRpIjoiYjk4OGIzNDItOGY2Ny00MmFlLTlhZmQtODg4ODk2YjNjZTIxIiwiYXVkIjoiMjVkbTM0aDY5cDllYmwwY245bnRuaTNvbmUiLCJldmVudF9pZCI6IjJjMTE4OTJhLTRmZWQtNDlhMS1hYTUxLThmYjk5ZTE5MmMxYiIsInVwZGF0ZWRfYXQiOjE2NDE0ODU5OTMsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQyOTgyNjc5LCJuYW1lIjoicHJ5bXNraXdlbkBnbWFpbC5jb20iLCJleHAiOjE2NDQ0Mjg2NTQsImlhdCI6MTY0NDQyNTA1NCwianRpIjoiOTI2MGM5MWEtODQ4Mi00NWQxLTg5NmUtNzQ3MWMwNWVmMzg1IiwiZW1haWwiOiJwcnltc2tpd2VuQGdtYWlsLmNvbSJ9.EaSWGrUnT4R--xlvdCOVaLVGBilYUcoQSc8aNbxo0rO6NCu4kebdovLirNSEgpxGNo9O1aGbgHHI8GOHErNvU6veXP0eDXIThU21H682cvSTzFrOgqslsMPKwjOQPQiHPsxQ6xiqLbsQZ34UPOP25Iu4EOaN_IOL5bgIE07kPzEjTOOk6nAfqIy3Nxl1LDFwy4LDZKlzPYjWoq1hG36V70VPaw-jjNvo1idWjAuEsqjnXo3fRwAz-5pKv0S3TX2PiQyceeGlTAxylShKy2zeON4ibE1_UyzJhSKFAVpTqB1_UXAZ-TpVditCvtNypAc8_PnJlMi9mN0i_WuKVqvYsQ";

              dispatch({
                type: INITIALIZE,
                payload: { isAuthenticated: true, user: attributes },
              });

              resolve({
                user,
                session,
                headers: { Authorization: token },
              });
            }
          });
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [getUserAttributes]
  );

  const initialize = useCallback(async () => {
    try {
      await getSession();
    } catch {
      dispatch({
        type: INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getSession]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signIn = useCallback(
    (email, password) =>
      new Promise((resolve, reject) => {
        const user = new CognitoUser({
          Username: email,
          Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });

        user.authenticateUser(authDetails, {
          onSuccess: async (data) => {
            console.log("success");
            await getSession();
            resolve(data);
          },
          onFailure: (err) => {
            console.log("failed", err);
            reject(err);
          },
          newPasswordRequired: function (userAttributes) {
            console.log("new password required");
            delete userAttributes.email_verified;
            userAttributes["name"] = userAttributes.email;
            user.completeNewPasswordChallenge(password, userAttributes, this);
          },
        });
      }),
    [getSession]
  );

  const signOut = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
      dispatch({ type: SIGN_OUT });
    }
  };

  const signUp = (email, password, firstName, lastName) =>
    new Promise((resolve, reject) => {
      UserPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: "email", Value: email }),
          new CognitoUserAttribute({
            Name: "name",
            Value: `${firstName} ${lastName}`,
          }),
        ],
        [],
        async (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(undefined);
          // Set destination URL here
          window.location.href = "/sales";
        }
      );
    });

  const forgotPassword = (email) =>
    new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
      });

      user.forgotPassword({
        onSuccess: (result) => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });

  const resetPassword = (email, verificationCode, newPassword) => {
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });
    return new Promise((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "cognito",
        user: {
          displayName: state?.user?.name || "Undefined",
          role: "user",
          ...state.user,
        },
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
