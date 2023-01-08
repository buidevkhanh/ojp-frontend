import { useEffect, useState } from "react";
import { getAdminInfo } from "../../api/user.api";
import { eraseCookie } from "../../helpers/cookie.helper";
import { AdminScreen } from "../../helpers/object.helper";
import Category from "./category";
import Contest from "./contest";
import Dashboard from "./overview";
import Problem from "./problems";
import Submission from "./submission";

function AdminIndex() {
  const [screen, setScreen] = useState(AdminScreen.DASHBOARD);
  const [Feature, setFeature] = useState(<Dashboard />);
  const [info, setInfo] = useState();
  useEffect(() => {
    getAdminInfo().then((data) => {
      setInfo(data.data);
    }).catch((error) => {
      window.location.replace('/admin/sign-in');
    });
  }, []);
  function changeScreen(newScreen) {
    setScreen(newScreen);
    switch (newScreen) {
      case AdminScreen.DASHBOARD: {
        setFeature(<Dashboard />);
        break;
      }
      case AdminScreen.PROBLEM: {
        setFeature(<Problem />);
        break;
      }
      case AdminScreen.CATEGORY: {
        setFeature(<Category />);
        break;
      }
      case AdminScreen.SUBMISSION: {
        setFeature(<Submission />);
        break;
      }
      case AdminScreen.CONTEST: {
        setFeature(<Contest />);
        break;
      }
      default:
        break;
    }
  }
  return (
    <>
      <div className="container-scroller">
        <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
            <div>
              <h2>
                OnlineJudge
              </h2>
            </div>
          </div>
          <div className="navbar-menu-wrapper d-flex align-items-top">
            <ul className="navbar-nav">
              <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
                <h1 className="welcome-text">
                  Xin chào bạn, <span className="text-black fw-bold">{info?.username || 'Anonymous'}</span>
                </h1>
                <h3 className="welcome-sub-text">
                  Trang quản lý hệ thống chấm bài trực tuyến OnlineJudge
                </h3>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown d-none d-lg-block user-dropdown">
                <a
                  className="nav-link"
                >
                  <img
                    className="img-xs rounded-circle"
                    src= {info?.avatar}
                    alt="Profile image"
                  />{" "}
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right navbar-dropdown"
                  aria-labelledby="UserDropdown"
                >
                  <div className="dropdown-header text-center">
                    <p className="mb-1 mt-3 font-weight-semibold">{info?.username}</p>
                    <p className="fw-light text-muted mb-0">
                      {info?.userEmail}
                    </p>
                  </div>
                  <a className="dropdown-item" onClick={() => {eraseCookie('__token'); window.location.reload()}}>
                    <i className="dropdown-item-icon mdi mdi-power text-primary me-2"></i>
                    Đăng xuất
                  </a>
                </div>
              </li>
            </ul>
            <button
              className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
              type="button"
              data-bs-toggle="offcanvas"
            >
              <span className="mdi mdi-menu"></span>
            </button>
          </div>
        </nav>
        <div className="container-fluid page-body-wrapper">
          <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
              <li className="nav-item nav-category">Các đầu mục quản lý</li>
              <li className="nav-item">
                <div>
                  <ul className="nav flex-column sub-menu">
                    <li className={`nav-item py-2 cursor ${screen === AdminScreen.DASHBOARD ? "link-active" : ""}`} onClick={() => changeScreen(AdminScreen.DASHBOARD)}>
                        <i class="fa-solid fa-gauge-simple mx-2"></i>
                        <span className="menu-title">Tổng quan</span>
                    </li>
                    <li className={`nav-item py-2 cursor ${screen === AdminScreen.PROBLEM ? "link-active" : ""}`} onClick={() => changeScreen(AdminScreen.PROBLEM)}>
                        <i class="fa-solid fa-calculator mx-2"></i>
                        Quản lý bài toán
                    </li>
                    <li className={`nav-item py-2 cursor ${screen === AdminScreen.CATEGORY ? "link-active" : ""}`} onClick={() => changeScreen(AdminScreen.CATEGORY)}>
                        <i class="fa-solid fa-table-cells mx-2"></i>
                        Quản lý danh mục
                    </li>
                    <li className={`nav-item py-2 cursor ${screen === AdminScreen.SUBMISSION ? "link-active" : ""}`}  onClick={() => changeScreen(AdminScreen.SUBMISSION)}>
                        <i class="fa-solid fa-file-import mx-2"></i>
                        Quản lý submit
                    </li>
                    <li className={`nav-item py-2 cursor ${screen === AdminScreen.CONTEST ? "link-active" : ""}`} onClick={() => {changeScreen(AdminScreen.CONTEST)}}>
                      <i class="fa-solid fa-file-pen mx-2"></i>
                      Quản lý bài thi
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="row">
                <div className="col-sm-12">
                  <div className="home-tab">
                    <div className="d-sm-flex align-items-center justify-content-between border-bottom">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a
                            className="nav-link active ps-0"
                          >
                            {screen !== AdminScreen.DASHBOARD ? 'Quản lý': 'Thông số'}
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content tab-content-basic">
                      <div
                        className="tab-pane fade show active"
                      >
                        {Feature}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
                  OnlineJudge là hệ thống chấm bài hỗ trợ đã ngôn ngữ, giúp người dùng học tập và luyện tập lập trình
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminIndex;
