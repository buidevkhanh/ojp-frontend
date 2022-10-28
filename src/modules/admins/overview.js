import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
Chart.register();

function Dashboard() {
  const state = {
    labels: ["Admins", "Students", "Teachers"],
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
        data: [1, 0, 0],
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
        data: [1100, 9200, 1000, 80, 3400],
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
        data: [100, 80],
      },
    ],
  };
  return (
    <>
      <div class="row">
        <div class="col-sm-12">
          <div class="statistics-details border-bottom pb-2 d-flex align-items-center justify-content-between">
            <div>
              <p class="statistics-title">Members</p>
              <h3 class="rate-percentage">1</h3>
              <p class="text-success text-center d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>+20</span>
              </p>
            </div>
            <div>
              <p class="statistics-title">Organizes</p>
              <h3 class="rate-percentage">0</h3>
              <p class="text-success d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>+0</span>
              </p>
            </div>
            <div>
              <p class="statistics-title">Problems</p>
              <h3 class="rate-percentage">0</h3>
              <p class="text-success d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>0</span>
              </p>
            </div>
            <div>
              <p class="statistics-title">Submissions</p>
              <h3 class="rate-percentage">0</h3>
              <p class="text-success d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>0</span>
              </p>
            </div>
            <div>
              <p class="statistics-title">Contests</p>
              <h3 class="rate-percentage">0</h3>
              <p class="text-success d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>0</span>
              </p>
            </div>
            <div>
              <p class="statistics-title">Topics</p>
              <h3 class="rate-percentage">0</h3>
              <p class="text-success d-flex">
                <i class="mdi mdi-menu-up"></i>
                <span>0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ul class="nav nav-tabs border-bottom mb-5" role="tablist">
        <li class="nav-item ">
          <a
            class="nav-link active ps-0"
            id="home-statisitc"
            data-bs-toggle="tab"
            href="#charts"
            role="tab"
            aria-controls="charts"
            aria-selected="true"
          >
            System statistics
          </a>
        </li>
      </ul>
      <div class="d-flex justify-content-between">
        <div class="w-25">
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
        <div class="w-25">
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
        <div class="w-25">
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
