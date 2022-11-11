import axios from "axios";
import { GET, SERVER_HOST, SERVER_PREFIX } from "../configs/app.config";
import { getCookie } from "../helpers/cookie.helper";

export function userGetInfor() {
  const token = getCookie('_token');
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/user`,
      method: GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}