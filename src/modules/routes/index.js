import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserAuth from "../users/auth";
import { VerifyAccount } from "../users/verify";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/auths/sign-in"
          element={<UserAuth state="sign-in" />}
        ></Route>
        <Route
          exact
          path="/auths/sign-up"
          element={<UserAuth state="sign-up" />}
        ></Route>
        <Route exact path="/auths/verify" element={<VerifyAccount />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
