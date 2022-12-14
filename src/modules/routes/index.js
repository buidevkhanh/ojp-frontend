import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminIndex from "../admins";
import AdminLogin from "../admins/login";
import UserAuth from "../users/auth";
import UserContest from "../users/contest";
import ContestOrganize from "../users/contest-organize";
import ProblemDetail from "../users/detail";
import UserHome from "../users/home";
import UserProblem from "../users/problem";
import Profile from "../users/profile";
import Ranking from "../users/ranking";
import UserSubmission from "../users/submission";
import { VerifyAccount } from "../users/verify";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/sign-in"
          element={<UserAuth state="sign-in" />}
        ></Route>
        <Route
          exact
          path="/sign-up"
          element={<UserAuth state="sign-up" />}
        ></Route>
        <Route exact path="/verify" element={<VerifyAccount />}></Route>
        <Route exact path="/admin/sign-in" element={<AdminLogin />}></Route>
        <Route exact path="/admin" element={<AdminIndex />}></Route>
        <Route exact path="/problem" element={<UserProblem />}></Route>
        <Route
          exact
          path="/problem/detail/*"
          element={<ProblemDetail />}
        ></Route>
        <Route exact path="/history" element={<UserSubmission/>}></Route>
        <Route exact path="/contest" element={<UserContest/>}></Route>
        <Route exact path="/start/contest/:id" element={<ContestOrganize/>}></Route>
        <Route exact path="/profile" element={<Profile/>}></Route>
        <Route exact path="/ranking" element={<Ranking/>}></Route>
        <Route path="/*" element={<UserHome />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
