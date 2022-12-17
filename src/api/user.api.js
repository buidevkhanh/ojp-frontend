import axios from "axios";
import { GET, PATCH, SERVER_HOST, SERVER_PREFIX } from "../configs/app.config";
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


export function userUpdateInfo(userInfo) {
  const token = getCookie('_token');
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/user`,
      method: PATCH,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        ...userInfo
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function userGetRanking(){
  const token = getCookie('_token');
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/user/ranking/me`,
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

export function getTopTen() {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/user/ranking`,
      method: GET
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}