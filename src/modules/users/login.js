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
          CH??O M???NG<br></br>
          OnlineJudge
        </h3>
        <h6
          className="text__secondary pb-4 sub__welcome"
          style={{ visibility: "hidden" }}
        >
          Luy???n t???p l???p tr??nh m???i ng??y
        </h6>
        <div className="auth__form text-start px-5 py-5 d-flex justify-content-center align-items-center flex-column">
          <h3 className="text__secondary   mb-3" style={{ fontWeight: "bold" }}>
            OnlineJudge
          </h3>
          <div className="w-100">
            <h6 className="auth__form__name text-left mb-3 text-center">
              ????? s??? d???ng to??n b??? t??nh n??ng, H??y <strong>????ng nh???p</strong> t??i kho???n c???a b???n
            </h6>
            <div className="form__input">
              <i className="fa fa-user" aria-hidden="true"></i>
              <input
                ref={nameOrEmail}
                name="username"
                placeholder="T??n ????ng nh???p ho???c email "
              ></input>
            </div>
            <div className="form__input">
              <i className="fa fa-lock" aria-hidden="true"></i>
              <input
                ref={password}
                name="password"
                type="password"
                placeholder="M???t kh???u"
              ></input>
            </div>
            <div
              onClick={() => signIn()}
              className="form__input__submit text-center mt-3 mb-5"
            >
              ????ng nh???p
            </div>
            <span
              className="text-secondary text-center"
              style={{
                fontSize: "10px !important",
                paddingTop: "20px !important",
              }}
            >
              <p>
                B???n ch??a c?? t??i kho???n ?{" "}
                <strong
                  onClick={() => window.location.replace("/sign-up")}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  ????ng k??
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
