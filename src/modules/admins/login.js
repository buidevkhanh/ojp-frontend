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
      <div class="d-flex f-column justify-content-center align-items-center full__screen">
        <div class="admin__login__header">Online Judge Project</div>
        <div class="admin__login__form">
          <div class="t-secondary">Email address</div>
          <div class="input__group">
            <input
              style={{ outline: "none !important", border: "none !important" }}
              ref={username}
              placeholder="Enter root email"
              type="text"
            />
            <i class="fa fa-user-o" aria-hidden="true"></i>
          </div>
          <div class="t-secondary mt-1">Password</div>
          <div class="input__group">
            <input
              style={{ outline: "none !important", border: "none !important" }}
              ref={password}
              type="password"
              placeholder="Enter root password"
            />
            <i class="fa fa-key" aria-hidden="true"></i>
          </div>
          <div class="login__area d-flex mt-3 justify-content-between">
            <div>
              <input type="checkbox" id="remember" /> Remember me ?
            </div>
            <div onClick={() => adminLogin()} class="login__button">
              Login
            </div>
          </div>
        </div>
        <div
          class="mt-3 t-main cursor"
          onClick={() => window.location.replace("/auths/sign-in")}
        >
          <i class="fa fa-arrow-left" aria-hidden="true"></i> Back to client
          home
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
