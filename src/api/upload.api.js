import axios from "axios";
import { POST, SERVER_HOST, SERVER_PREFIX } from "../configs/app.config";

export function callSingleUpload(params) {
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    formData.append("image", params.file);
    axios
      .post(`${SERVER_HOST}${SERVER_PREFIX}/single-upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
