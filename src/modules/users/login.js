import { useRef, useState } from "react";
import { callResendCode, callSignIn } from "../../api/auth.api";
import { getCookie, setCookie } from "../../helpers/cookie.helper";
import { getRefValue } from "../../helpers/string.helper";
import { Toaster } from "../commons/toast";

export function Login() {
  const nameOrEmail = useRef();
  const password = useRef();
  const [toast, setToast] = useState(<></>);

  function signIn() {
    const nameOrEmailTxt = getRefValue(nameOrEmail);
    const passwordTxt = getRefValue(password);
    if (nameOrEmailTxt && passwordTxt) {
      callSignIn({ nameOrEmail: nameOrEmailTxt, password: passwordTxt })
        .then((data) => {
          setCookie("_token", data.data.accessToken);
          setCookie("_refresh", data.data.refreshToken, 30);
          window.location.replace(getCookie('_prev'));
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
          if (
            error?.response?.data?.message?.includes("not_verfied") ||
            error?.response?.data?.message?.includes("not_verified")
          ) {
            setCookie("_userNeedVerified", nameOrEmailTxt);
            callResendCode(getCookie("_userNeedVerified"))
              .then(() => {
                window.location.replace("/verify");
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
        });
    } else {
      setToast(
        <Toaster message={"UserName or Password Is Empty"} type="error" />
      );
    }
  }

  return (
    <>
      {toast}
      <div className="w-50 d-flex text-center justify-content-end align-items-center login__container flex-column">
        <h3
          className="text-white mb-1 sub__welcome"
          style={{ fontWeight: "bold", visibility: "hidden" }}
        >
          CHÀO MỪNG<br></br>
          OnlineJudge
        </h3>
        <h6
          className="text__secondary pb-4 sub__welcome"
          style={{ visibility: "hidden" }}
        >
          Luyện tập lập trình mỗi ngày
        </h6>
        <div className="auth__form text-start px-5 py-5 d-flex justify-content-center align-items-center flex-column">
          <h3 className="text__secondary   mb-3" style={{ fontWeight: "bold" }}>
            OnlineJudge
          </h3>
          <div className="w-100">
            <h6 className="auth__form__name text-left mb-3 text-center">
              Để sử dụng toàn bộ tính năng, Hãy <strong>đăng nhập</strong> tài khoản của bạn
            </h6>
            <div className="form__input">
              <i className="fa fa-user" aria-hidden="true"></i>
              <input
                ref={nameOrEmail}
                name="username"
                placeholder="Tên đăng nhập hoặc email "
              ></input>
            </div>
            <div className="form__input">
              <i className="fa fa-lock" aria-hidden="true"></i>
              <input
                ref={password}
                name="password"
                type="password"
                placeholder="Mật khẩu"
              ></input>
            </div>
            <div
              onClick={() => signIn()}
              className="form__input__submit text-center mt-3 mb-5"
            >
              Đăng nhập
            </div>
            <span
              className="text-secondary text-center"
              style={{
                fontSize: "10px !important",
                paddingTop: "20px !important",
              }}
            >
              <p>
                Bạn chưa có tài khoản ?{" "}
                <strong
                  onClick={() => window.location.replace("/sign-up")}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  Đăng ký
                </strong>{" "}
                ngay !
              </p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
