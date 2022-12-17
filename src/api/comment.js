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

const BASE = 'http://localhost:8080/api/v1/comment';

export function getComments(problemId) {
    return new Promise((resolve, reject) => {
        axios({
        method: GET,
        url: `${BASE}/${problemId}`,
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export function userComment(content, problemId) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: POST,
        url: `${BASE}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            content, 
            problemId
        }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export function editComment(commentId, content) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: PATCH,
        url: `${BASE}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            content, 
            commentId
        }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export function userReply(content, commentId) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: POST,
        url: `${BASE}/reply`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            content, 
            commentId
        }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export async function updateReply(replyId, content) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: PATCH,
        url: `${BASE}/reply`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            content, 
            replyId
        }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export async function getOwnReaction(problemId) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: GET,
        url: `${BASE}/reaction/problem/${problemId}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}

export async function reaction(targetId) {
    const token = getCookie('_token');
    return new Promise((resolve, reject) => {
        axios({
        method: POST,
        url: `${BASE}/reaction`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            targetId,
            reactionType: 'agreement'
        }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        })
    });
}