import { useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { callSignUp } from "../../api/auth.api";
import { setCookie } from "../../helpers/cookie.helper";
import { getRefValue } from "../../helpers/string.helper";
import { Toaster } from "../commons/toast";

export function Register() {
  const [toast, setToast] = useState(<></>);
  const [role, setRole] = useState("student");
  const username = useRef();
  const password = useRef();
  const repassword = useRef();
  const displayName = useRef();
  const email = useRef();
  const signUpBtn = (
    <div
      onClick={() => userSignUp()}
      className="form__input__submit text-center mt-3 mb-5"
    >
      <span className="submit__input__state">Sign up</span>
    </div>
  );
  const [submitState, setSubmitState] = useState(signUpBtn);
  function callApi() {
    const usernameTxt = getRefValue(username);
    const passwordTxt = getRefValue(password);
    const repassTxt = getRefValue(repassword);
    const displayTxt = getRefValue(displayName);
    const emailTxt = getRefValue(email);
    if (passwordTxt !== repassTxt) {
      setToast(<Toaster message="Password didn't match" type="error" />);
      setTimeout(() => {
        setSubmitState(signUpBtn);
      }, 500);
      return;
    }
    callSignUp({
      username: usernameTxt,
      userPass: passwordTxt,
      displayName: displayTxt,
      userEmail: emailTxt,
      role: role,
    })
      .then(() => {
        setUp();
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
        setTimeout(() => {
          setSubmitState(signUpBtn);
        }, 500);
      });
  }

  function setUp() {
    setToast(
      <Toaster message="Register account success ! verify it" type="success" />
    );
    setCookie("_userNeedVerified", getRefValue(email), 1);
    setTimeout(() => {
      setSubmitState(signUpBtn);
    }, 500);
    setTimeout(() => {
      window.location.replace("/auths/verify");
    }, 1000);
  }

  function userSignUp() {
    setSubmitState(
      <span className="d-inline-block mt-5 mb-5" style={{ height: "40px" }}>
        <BeatLoader color="red" speedMultiplier={0.5} size="10" />
      </span>
    );
    callApi();
  }
  return (
    <>
      {toast}
      <div className="w-50 d-flex text-center justify-content-end align-items-center login__container flex-column">
        <h3
          className="text-white mb-1 sub__welcome"
          style={{ fontWeight: "bold", visibility: "hidden" }}
        >
          WELCOME<br></br>
          Online Judge System
        </h3>
        <h6
          className="text__secondary pb-4 sub__welcome"
          style={{ visibility: "hidden" }}
        >
          Learn to code every day
        </h6>
        <div className="auth__form text-start px-5 py-5 d-flex justify-content-center align-items-center flex-column">
          <h3 className="text__secondary mb-3" style={{ fontWeight: "bold" }}>
            Online Judge System
          </h3>
          <div className="w-100">
            <h6 className="auth__form__name text-left mb-3 text-center">
              Create your account, <strong>Sign up</strong>
            </h6>
            <div className="form__input">
              <i className="fa fa-user mr-2" aria-hidden="true"></i>
              <input
                ref={username}
                name="username"
                placeholder="Enter your username"
              ></input>
            </div>
            <div className="form__input">
              <i
                className="fa fa-lock"
                style={{ marginRight: "10px" }}
                aria-hidden="true"
              ></i>
              <div className="group__input">
                <div className="form__input">
                  <input
                    ref={password}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  ></input>
                </div>
                <div className="form__input">
                  <input
                    ref={repassword}
                    name="password"
                    type="password"
                    placeholder="Re-password"
                  ></input>
                </div>
              </div>
            </div>
            <div className="form__input">
              <i className="fa fa-question-circle mr-1" aria-hidden="true"></i>
              <input
                ref={displayName}
                name="username"
                placeholder="Enter your display name"
              ></input>
            </div>
            <div className="form__input">
              <i className="fa fa-envelope-o" aria-hidden="true"></i>
              <input
                ref={email}
                name="username"
                placeholder="Enter your email"
              ></input>
            </div>
            <div className="form__input">
              <i
                class="fa fa-male"
                style={{ marginRight: "15px" }}
                aria-hidden="true"
              ></i>
              <div className="group__select">
                <div className="form__input form__select">
                  <div
                    onClick={() => setRole("student")}
                    className={
                      role === "student"
                        ? "form__options__active"
                        : "form__options"
                    }
                  >
                    I'm Student
                  </div>
                </div>
                <div className="form__input form__select">
                  <div
                    onClick={() => setRole("teacher")}
                    className={
                      role === "teacher"
                        ? "form__options__active"
                        : "form__options"
                    }
                  >
                    I'm Teacher
                  </div>
                </div>
              </div>
            </div>
            {submitState}
            <span
              style={{
                fontSize: "10px !important",
                paddingTop: "20px !important",
              }}
            >
              <p>
                Already have account ?{" "}
                <strong
                  onClick={() => window.location.replace("/auths/sign-in")}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  Sign in
                </strong>{" "}
                now !
              </p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
