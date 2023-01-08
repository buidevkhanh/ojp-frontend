import { useRef, useState } from "react";
import { callActiveAccount } from "../../api/auth.api";
import { getCookie } from "../../helpers/cookie.helper";
import { getRefValue } from "../../helpers/string.helper";
import Footer from "../commons/footer";
import { Toaster } from "../commons/toast";

export function VerifyAccount() {
  const verifySubmitActive = (
    <div
      onClick={() => {
        handleSubmit();
        countDown();
      }}
      className="verify__submit__input text-center"
      value="Verify E-mail"
    >
      Verify E-mail
    </div>
  );
  const verifySubmitInactive = (
    <div
      className="verify__submit__input submit__inactive text-center"
      value="Verify E-mail"
    >
      Verify E-mail
    </div>
  );
  const _code = useRef();

  const [submit, setSubmit] = useState(verifySubmitActive);
  const [remain, setRemain] = useState(0);
  const [wait, setWait] = useState(false);
  const [toast, setToast] = useState(<></>);
  function handleInputChange() {
    if (_code.current.value.length === 5) {
      document
        .querySelector(".verify__code__input")
        .classList.add("full__charactor");
    } else {
      document
        .querySelector(".verify__code__input")
        .classList.remove("full__charactor");
    }
  }
  function handleSubmit() {
    setSubmit(verifySubmitInactive);
    callActiveAccount(getCookie("_userNeedVerified"), getRefValue(_code))
      .then(() => {
        setToast(
          <Toaster
            message="active account success, please login"
            type="error"
          />
        );
        window.location.replace("/sign-in");
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
      })
      .finally(() => {
        setSubmit(verifySubmitActive);
      });
  }
  function countDown() {
    if (!wait) {
      const nextMock = new Date(
        new Date().setMinutes(new Date().getMinutes() + 1)
      );
      const countRemain = setInterval(() => {
        if (new Date() - nextMock < 0) {
          setRemain(Math.ceil((nextMock - new Date()) / 1000));
        } else {
          setSubmit(verifySubmitActive);
          setRemain(0);
          clearInterval(countRemain);
          setWait(false);
        }
      }, 1000);
      setWait(() => true);
    }
  }
  return (
    <>
      {toast}
      <div className="container">
        <div className="site__logo">Online Judge System OJS</div>
        <div className="verify__header text-center text-center">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
          <div className="verify__thanks pb-2">Thank for your signup</div>
          <h4
            className="veirfy__title text-white pb-4"
            style={{ fontWeight: "bolder" }}
          >
            Verify your E-mail address
          </h4>
        </div>
        <div className="verify__content text-center py-5">
          <div className="d-flex justify-content-center align-items-center">
            <div className="w-75">
              <strong>Hello newbie,</strong>
              <br></br>
              We have been send verify code to your email address, please enter
              activate code to below input to verify your email address and
              enjoy exclusive cleaning services with us
            </div>
          </div>
        </div>
        <div className="verify__code">
          <input
            onChange={() => {
              handleInputChange();
            }}
            ref={_code}
            className="verify__code__input"
            type="text"
            maxLength="5"
          ></input>
        </div>
        {submit}
        <div
          className="text-center pb-3 text__secondary"
          style={{ cursor: "pointer" }}
        >
          <span className="resend__code">
            Resend verify code{remain === 0 ? "" : `, remaining (${remain}s)`}
          </span>
        </div>
        <div className="verify__thank__you text-center pb-5">
          Thank you, <br></br> The developer, Khanh
        </div>
      </div>
      <Footer />
    </>
  );
}
