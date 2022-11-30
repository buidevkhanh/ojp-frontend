import axios from "axios";
import { DELETE, GET, SERVER_HOST, SERVER_PREFIX } from "../configs/app.config";
import { getCookie } from "../helpers/cookie.helper";

export function getSubmission(page, author) {
    const token = getCookie("_token");
    return new Promise((resolve, reject) => {
      axios({
        url: `${SERVER_HOST}${SERVER_PREFIX}/submission?page=${page}&pageSize=20&sort=createdAt:-1&author=${author ? "me" : null}`,
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

export function callDetailSubmit(submission) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/submission/${submission}`,
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

export function adminGetSubmit() {
  const token = getCookie("__token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/submission`,
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

export function adminRemoveSubmit(id) {
  const token = getCookie("__token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/${id}/submission`,
      method: DELETE,
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