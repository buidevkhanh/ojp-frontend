import { useEffect, useState } from "react";
import { userGetInfor } from "../../api/user.api";
import { setCookie } from "../../helpers/cookie.helper";

export default function NavigationBar(props) {
  const [currentPath, setPath] = useState("");
  const [user, setUser] = useState();
  useEffect(() => {
    userGetInfor().then((data) => {
      setUser(data.data);
      props?.setUser(data.data);
    });
    setPath(window.location.pathname.slice(1));
  }, []);
  function handleCanvasOpen() {
    const canvasBar = document.querySelector(".offcanvas__menu__wrapper");
    const canvasOpenBtn = document.querySelector(".canvas__open");
    const mobileMenuBar = document.querySelector(
      ".offcanvas__menu__wrapper .offcanvas__menu"
    );
    canvasBar.style.opacity = 1;
    canvasBar.style.left = 0;
    mobileMenuBar.style.display = "block";
    canvasOpenBtn.style.display = "none";
  }
  function handleCanvasClose() {
    const canvasBar = document.querySelector(".offcanvas__menu__wrapper");
    const canvasOpenBtn = document.querySelector(".canvas__open");
    const mobileMenuBar = document.querySelector(
      ".offcanvas__menu__wrapper .offcanvas__menu"
    );
    canvasOpenBtn.style.display = "block";
    canvasBar.style.opacity = 0;
    canvasBar.style.left = "-300px";
    mobileMenuBar.style.display = "none";
  }
  function handleLogin() {
    setCookie('_prev', window.location.pathname);
    window.location.replace("/sign-in");
  }
  return (
    <>
      <div className="offcanvas__menu__wrapper">
        <div className="canvas__close" onClick={() => handleCanvasClose()}>
          <span className="fa fa-times-circle-o"></span>
        </div>
        <div className="offcanvas__logo">
          <a href="#">
            <img src="img/logo.png" alt="" />
          </a>
        </div>
        { props.scope !== 'limited' ?
        <nav className="offcanvas__menu mobile-menu">
          <ul>
            <li
              className={
                currentPath === "" || currentPath === "home" ? "active" : ""
              }
            >
              <a href="/">Trang chủ</a>
            </li>
            <li className={currentPath === "problem" ? "active" : ""}>
              <a href="/problem">Bài toán</a>
            </li>
            <li className={currentPath === "contest" ? "active" : ""}>
              <a href="/contest">Kỳ thi</a>
            </li>
            <li className={currentPath === "history" ? "active" : ""}>
              <a href="/history">Lịch sử</a>
            </li>
            <li className={currentPath === "ranking" ? "active" : ""}>
              <a href="/ranking">Xếp hạng</a>
            </li>
          </ul>
        </nav> : null 
        }
        <div id="mobile-menu-wrap"></div>
        <div className="offcanvas__auth">
          <ul>
            <li>
              { user ? 
              <span>
                <img width={'20px'} onClick={() => window.location.replace('/profile')} height={'20px'} src={user.avatar} alt="user-avatar" style={{borderRadius: '50%'}}></img> {user.displayName}
              </span> :
              <a onClick={()=>handleLogin()} className="text-white">
                <span className="fa fa-user"></span>
                <span className="cursor">Đăng nhập | Đăng ký</span>
              </a>
              }
            </li>
          </ul>
        </div>
        <div className="offcanvas__info">
          <ul>
            <li>
              <i class="fa-solid fa-mobile-screen mx-2"></i> +8437 369 8822
            </li>
            <li>
            <i class="fa-regular fa-envelope mx-2"></i> buiduckhanh.dev@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <header className="header-section header-normal">
        <div className="header__info">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="header__info-left">
                  <ul>
                    <li>
                      <i class="fa-solid fa-mobile-screen mx-2"></i> +8437 369 8822
                    </li>
                    <li>
                    <i class="fa-regular fa-envelope mx-2"></i> buiduckhanh.dev@gmail.com
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="header__info-right">
                  <ul>
                    <li>
                    { user ? 
                      <span className="text-white">
                        <img onClick={() => window.location.replace('/profile')} className="mr-1" width={'26px'} height={'26px'} src={user.avatar} alt="user-avatar" style={{borderRadius: '50%'}}></img> {user.displayName}
                      </span> :
                      <a onClick={()=>handleLogin()} className="text-white cursor">
                        <span className="fa fa-user"></span>
                        Đăng nhập | Đăng ký
                      </a>
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row" style={{ height: "70px" }}>
            { props.scope !== 'limited' ?
            <div className="col-lg-3 col-md-3">
              <div style={{ lineHeight: "70px", height: "70px" }}>
                <p
                  style={{
                    lineHeight: "70px",
                    fontSize: "25px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <span className="text-secondary">Online</span>Judge
                </p>
              </div>
            </div> :
            <div className="col-lg-12 col-md-12 text-center">
              <div style={{ lineHeight: "70px", height: "70px" }}>
                <p
                  style={{
                    lineHeight: "70px",
                    fontSize: "25px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  OnlineJudge Contest
                </p>
              </div>
            </div>
            } 
            <div
              className="col-lg-9 col-md-9"
              style={{ height: "fit-content" }}
            >
              { props.scope !== 'limited' ?
              <nav className="header__menu">
                <ul>
                  <li
                    className={
                      currentPath === "" || currentPath === "home"
                        ? "active"
                        : ""
                    }
                  >
                    <a href="/">
                      <i className="fa fa-home mx-1" aria-hidden="true"></i>
                      Trang chủ
                    </a>
                  </li>
                  <li className={currentPath === "problem" ? "active" : ""}>
                    <a href="/problem">
                      <i
                        className="fa fa-list-alt mx-1"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      ></i>
                      Bài toán
                    </a>
                  </li>
                  <li className={currentPath === "contest" ? "active" : ""}>
                    <a href="/contest">
                      <i
                        className="fa fa-pencil-square-o mx-1"
                        aria-hidden="true"
                      ></i>
                      Kỳ thi
                    </a>
                  </li>
                  <li className={currentPath === "history" ? "active" : ""}>
                    <a href="/history">
                      <i className="fa fa-history mx-1" aria-hidden="true"></i>
                      Lịch sử
                    </a>
                  </li>
                  <li className={currentPath === "ranking" ? "active" : ""}>
                    <a href="/ranking">
                      <i
                        className="fa fa-camera-retro mx-1"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      ></i>
                      Xếp hạng
                    </a>
                  </li>
                </ul>
              </nav> : null }
            </div>
          </div>
          <div className="canvas__open" onClick={() => handleCanvasOpen()}>
            <span className="fa fa-bars"></span>
          </div>
        </div>
      </header>
    </>
  );
}
