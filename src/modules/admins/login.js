import { useRef, useState } from "react";
import { callAdminLogin } from "../../api/auth.api";
import { setCookie } from "../../helpers/cookie.helper";
import { getRefValue } from "../../helpers/string.helper";
import { Toaster } from "../commons/toast";
import "./css/admin_login.css";

function AdminLogin() {
  const [toast, setToast] = useState(<></>);
  const username = useRef();
  const password = useRef();
  function adminLogin() {
    const nameOrEmail = getRefValue(username);
    const passwordTxt = getRefValue(password);
    const remem = document.querySelector("#remember");
    callAdminLogin(nameOrEmail, passwordTxt)
      .then((data) => {
        let isSave;
        if (remem.checked) isSave = 30;
        setCookie("__token", data.data.token, isSave);  
        setToast(<Toaster message="Login success" type="success" />);
        window.location.replace("/admin");
      })
      .catch((error) => {
        setToast(
          <Toaster
            message={
              error.response.status !== 0
                ? error.response.data.message
                  ? error.response.data.message
                  : error.message
                : error.message
            }
            type="error"
          />
        );
      });
  }
  return (
    <>
      {toast}
      <div className="d-flex f-column justify-content-center align-items-center full__screen">
        <div className="admin__login__header">Online Judge Project</div>
        <div className="admin__login__form">
          <div className="t-secondary">Địa chỉ email</div>
          <div className="input__group">
            <input
              style={{ outline: "none !important", border: "none !important" }}
              ref={username}
              placeholder="Nhập địa chỉ email..."
              type="text"
            />
            <i className="fa fa-user-o" aria-hidden="true"></i>
          </div>
          <div className="t-secondary mt-1">Mật khẩu</div>
          <div className="input__group">
            <input
              style={{ outline: "none !important", border: "none !important" }}
              ref={password}
              type="password"
              placeholder="Nhập mật khẩu..."
            />
            <i className="fa fa-key" aria-hidden="true"></i>
          </div>
          <div className="login__area d-flex mt-3 justify-content-between">
            <div>
              <input type="checkbox" id="remember" /> Ghi nhớ ?
            </div>
            <div onClick={() => adminLogin()} className="login__button">
              Đăng nhập
            </div>
          </div>
        </div>
        <div
          className="mt-4 t-main cursor"
          onClick={() => window.location.replace("/sign-in")}
        >
          <i className="fa fa-arrow-left mx-2" aria-hidden="true"></i> Màn hình người dùng
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
