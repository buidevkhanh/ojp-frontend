import { useEffect, useState } from "react";
import { Loading } from "../commons/loading";
import { Login } from "./login";
import { Register } from "./register";

export default function UserAuth(props) {
  const [authState, setAuthState] = useState("sign-in");
  useEffect(() => {
    setAuthState(props.state);
  }, [props]);

  return authState ? (
    <>
      <div className="full__width full__height page__auth">
        <div className="d-flex full__height justify-content-center align-items-center main__padding">
          <div className="auth__left w-50">
            <h2 className="text-white mb-1" style={{ fontWeight: "bold" }}>
              Welcome to Online Judge System
            </h2>
            <h6 className="text__secondary pb-5">
              Try to practice coding every day to improve your programming
              skills
            </h6>
            <img src="/assets/img/main/coder_01.png" alt="coder_image"></img>
          </div>
          {authState && authState === "sign-up" ? <Register /> : <Login />}
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
}
