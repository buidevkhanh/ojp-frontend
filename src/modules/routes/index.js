import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminIndex from "../admins";
import AdminLogin from "../admins/login";
import UserAuth from "../users/auth";
import ProblemDetail from "../users/detail";
import UserHome from "../users/home";
import UserProblem from "../users/problem";
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
        <Route exact path="/admin/sign-in" element={<AdminLogin />}></Route>
        <Route exact path="/admin" element={<AdminIndex />}></Route>
        <Route exact path="/problem" element={<UserProblem />}></Route>
        <Route
          exact
          path="/problem/detail/*"
          element={<ProblemDetail />}
        ></Route>
        <Route path="/*" element={<UserHome />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
