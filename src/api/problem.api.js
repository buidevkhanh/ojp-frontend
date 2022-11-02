import axios from "axios";
import {
  DELETE,
  GET,
  PATCH,
  POST,
  SERVER_HOST,
  SERVER_PREFIX,
} from "../configs/app.config";
import { getCookie } from "../helpers/cookie.helper";

export function callGetProblem(page) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem?page=${page}&pageSize=20`,
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

export function callCreateProblem(params) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem`,
      method: POST,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export function callChangeStatus(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/${id}/status`,
      method: PATCH,
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

export function callUpdateProblem(id, data) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/${id}`,
      method: PATCH,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callProblemDetail(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/${id}`,
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

export function callProblemUpdate(id, data) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/${id}`,
      method: PATCH,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function userGetProblem(page, pageSize, sort) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/problem?page=${page}&pageSize=${pageSize}&sort=${sort}`,
      method: GET,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function callDeteletTestcase(testcases) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/testcase`,
      method: DELETE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        testcaseIds: testcases,
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

export function callAddTestcase(problemId, testcases) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/problem/testcase/${problemId}`,
      method: POST,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        testcases: testcases,
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
