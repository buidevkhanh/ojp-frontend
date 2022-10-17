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
