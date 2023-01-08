import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useEffect, useState } from "react";
import { adminStatistic, getAdminInfo } from "../../api/user.api";
Chart.register();

function Dashboard() {
  const [stats, setStats] = useState();
  const [admin, setAdmin] = useState();
  const [user, setUser] = useState();
  const [submit, setSubmit] = useState();
  const [problem, setProblem] = useState();
  const [contest, setContest] = useState();
  const [submission, setSubmission] = useState();
  useEffect(() => {
    adminStatistic().then((data) => {
      setStats(data.data);
      setUser(data.data.user.filter((item) => { return item._id === 'student'})[0]?.count);
      setAdmin(data.data.user.filter((item) => { return item._id === 'admin'})[0]?.count);
      const ac = data.data.submission.filter((item) => { return item._id === 'Accepted'})[0]?.count;
      const tle = data.data.submission.filter((item) => { return item._id === 'Time Limited Execeeded'})[0]?.count;
      const ce = data.data.submission.filter((item) => { return item._id === 'Compile error'})[0]?.count;
      const rte = data.data.submission.filter((item) => { return item._id === 'Runtime error'})[0]?.count;
      const wa = data.data.submission.filter((item) => { return item._id === 'Wrong Answer'})[0]?.count;
      setSubmit({ac, tle, ce, rte, wa});
      const med = data.data.problem.filter((item) => { return item._id === 'medium'})[0].count;
      const eas = data.data.problem.filter((item) => { return item._id === 'easy'})[0].count;
      setProblem({med, eas});
      setContest(data.data.contest)
      setSubmission(ac + tle + ce + rte + wa);
    })
  }, [])
  const state = {
    labels: ["Admins", "Students"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#ec6258",
          "#fbc04f",
        ],
        hoverBackgroundColor: [
          "#dc5248",
          "#fab03f",
        ],
        data: [admin || 0, user || 0],
      },
    ],
  };
  const state2 = {
    labels: ["AC", "WA", "TLE", "CE", "RTE"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#ec6258",
          "#fbc04f",
          "#69ba6c",
          "#ed61ae",
          "#62aadf",
        ],
        hoverBackgroundColor: [
          "#dc5248",
          "#fab03f",
          "#59aa5c",
          "#dd519e",
          "#529acf",
        ],
        data: [submit?.ac || 0, submit?.wa || 0, submit?.tle || 0, submit?.ce || 0, submit?.rte || 0],
      },
    ],
  };
  const state3 = {
    labels: ["Easy", "Medium"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#ec6258",
          "#fbc04f",
          "#69ba6c",
          "#ed61ae",
          "#62aadf",
        ],
        hoverBackgroundColor: [
          "#dc5248",
          "#fab03f",
          "#59aa5c",
          "#dd519e",
          "#529acf",
        ],
        data: [problem?.eas, problem?.med],
      },
    ],
  };
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="statistics-details border-bottom pb-2 d-flex align-items-center justify-content-between">
            <div className="text-center">
              <p className="statistics-title">Thành viên hệ thống</p>
              <h3 className="rate-percentage">{user + admin || 0}</h3>
            </div>
            <div className="text-center">
              <p className="statistics-title">Bài toán</p>
              <h3 className="rate-percentage">{problem?.eas + problem?.med || 0}</h3>
            </div>
            <div className="text-center">
              <p className="statistics-title">Số submit</p>
              <h3 className="rate-percentage">{submission || 0}</h3>
            </div>
            <div className="text-center">
              <p className="statistics-title">Số bài thi</p>
              <h3 className="rate-percentage">{contest || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      <ul className="nav nav-tabs border-bottom mb-5" role="tablist">
        <li className="nav-item ">
            Tổng quan hệ thống
        </li>
      </ul>
      <div className="d-flex justify-content-between">
        <div className="w-25">
          <Doughnut
            data={state}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  title: "Submissions chart",
                  backgroundColor: "#003350",
                },
                title: {
                  display: true,
                  position: "top",
                  text: "Members",
                },
              },
            }}
          />
        </div>
        <div className="w-25">
          <Doughnut
            data={state2}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  title: "Members chart",
                  backgroundColor: "#003350",
                },
                title: {
                  display: true,
                  position: "top",
                  text: "Submissions",
                },
              },
            }}
          />
        </div>
        <div className="w-25">
          <Doughnut
            data={state3}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  title: "Members chart",
                  backgroundColor: "#003350",
                },
                title: {
                  display: true,
                  position: "top",
                  text: "Problems",
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
