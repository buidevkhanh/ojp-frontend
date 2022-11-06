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

export function callCreateCategory(params) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category`,
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

export function callGetCategory(page) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category?page=${page}&pageSize=20`,
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

export function userGetCategory(page) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/category?page=${
        page || ""
      }&pageSize=-1`,
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

export function callRemoveCategory(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category/${id}`,
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

export function callCategoryDetail(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category/${id}`,
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

export function callUpdateCategory(categoryId, categoryLogo, categoryName) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    const data = {
      categoryId,
      categoryLogo,
      categoryName,
    };
    if (!categoryLogo) delete data.categoryLogo;
    if (!categoryName) delete data.categoryName;
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category`,
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

export function callChangeCategory(id) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category/${id}/status`,
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

export function callGetAllCategory(filter) {
  const token = getCookie("_token");
  return new Promise((resolve, reject) => {
    axios({
      url: `${SERVER_HOST}${SERVER_PREFIX}/admin/category?pageSize=-1&${filter}`,
      method: "GET",
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
