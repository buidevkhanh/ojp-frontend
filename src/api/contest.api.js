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

export function callCreateContest(params) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/contest`,
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

export function callGetContest() {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/contest?page=1&pageSize=-1`,
      method: GET,
      headers: {
        Authorization: `Bearer ${token}`,
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

export function userGetContest() {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/contest?page=1&pageSize=-1`,
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

export function userGetOwn(time) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/contest/own?page=1&pageSize=-1&time=${time || null}`,
      method: GET,
      headers: {
        Authorization: `Bearer ${token}`,
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

export function callRegister(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/contest/register/${id}`,
      method: POST,
      headers: {
        Authorization: `Bearer ${token}`,
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

export function userGetProblem(
  page,
  pageSize,
  sort,
  name,
  code,
  level,
  category
) {
  return new Promise((resolve, reject) => {
    const token = getCookie('_token');
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/problem?page=${
        page || ""
      }&pageSize=${pageSize || ""}&sort=${sort || ""}&name=${name || ""}&code=${
        code || ""
      }&level=${level || ""}&category=${category || ""}`,
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

export function callGetDetail(code) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/problem/detail?code=${code || ""}`,
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
