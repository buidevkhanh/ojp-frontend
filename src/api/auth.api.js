import axios from "axios";
import { POST, SERVER_HOST, SERVER_PREFIX } from "../configs/app.config";

export function callSignUp(params) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/auths/signup`,
      method: POST,
      data: params,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callSignIn(params) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/auths/signin`,
      method: "POST",
      data: params,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callResendCode(nameOrEmail) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/users/resend-code`,
      method: "POST",
      data: { nameOrEmail },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callActiveAccount(nameOrEmail, token) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/users/active`,
      method: "POST",
      data: { nameOrEmail, token },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callAdminLogin(email, password) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/sign-in`,
      method: "POST",
      data: { email, password },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
