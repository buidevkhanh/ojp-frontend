import { useEffect, useState } from "react";
import { userGetInfor } from "../../api/user.api";
import { setCookie } from "../../helpers/cookie.helper";

export default function NavigationBar(props) {
  const [currentPath, setPath] = useState("");
  const [user, setUser] = useState();
  useEffect(() => {
    userGetInfor().then((data) => {
      setUser(data.data);
    });
    setPath(window.location.pathname.slice(1));
    console.log(currentPath);
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
    window.location.replace("/auths/sign-in");
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
              <a href="/">Home</a>
            </li>
            <li className={currentPath === "problem" ? "active" : ""}>
              <a href="/problem">Problem</a>
            </li>
            <li className={currentPath === "contest" ? "active" : ""}>
              <a href="/contest">Contest</a>
            </li>
            <li className={currentPath === "history" ? "active" : ""}>
              <a href="/history">History</a>
            </li>
            <li className={currentPath === "course" ? "active" : ""}>
              <a href="/course">Courses</a>
            </li>
            <li className={currentPath === "guide" ? "active" : ""}>
              <a href="/guide">Guide</a>
            </li>
          </ul>
        </nav> : null 
        }
        <div id="mobile-menu-wrap"></div>
        <div className="offcanvas__auth">
          <ul>
            <li>
              <a href="#">
                <span className="icon_chat_alt"></span> Live chat
              </a>
            </li>
            <li>
              { user ? 
              <span>
                <img width={'20px'} height={'20px'} src={user.avatar} alt="user-avatar" style={{borderRadius: '50%'}}></img> {user.displayName}
              </span> :
              <a onClick={()=>handleLogin()} class="text-white">
                <span className="fa fa-user"></span>
                <span class="cursor">Login / Register</span>
              </a>
              }
            </li>
          </ul>
        </div>
        <div className="offcanvas__info">
          <ul>
            <li>
              <span className="icon_phone"></span> +8437 369 8822
            </li>
            <li>
              <span className="fa fa-envelope"></span> buiduckhanh.dev@gmail.com
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
                      <span className="icon_phone"></span> +8437 3698822
                    </li>
                    <li>
                      <span className="fa fa-envelope"></span>{" "}
                      buiduckhanh.dev@gmail.com
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="header__info-right">
                  <ul>
                    <li>
                      <a href="https://fb.com/duckhanh4444">
                        <span className="icon_chat_alt"></span> Live chat
                      </a>
                    </li>
                    <li>
                    { user ? 
                      <span class="text-white">
                        <img class="mr-1" width={'26px'} height={'26px'} src={user.avatar} alt="user-avatar" style={{borderRadius: '50%'}}></img> {user.displayName}
                      </span> :
                      <a onClick={()=>handleLogin()} class="text-white cursor">
                        <span className="fa fa-user"></span>
                        Login / Register
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
                  <span class="text-secondary">Online</span>Judge
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
                      <i class="fa fa-home mx-1" aria-hidden="true"></i>
                      Home
                    </a>
                  </li>
                  <li className={currentPath === "problem" ? "active" : ""}>
                    <a href="/problem">
                      <i
                        class="fa fa-list-alt mx-1"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      ></i>
                      Problem
                    </a>
                  </li>
                  <li className={currentPath === "contest" ? "active" : ""}>
                    <a href="/contest">
                      <i
                        class="fa fa-pencil-square-o mx-1"
                        aria-hidden="true"
                      ></i>
                      Contest
                    </a>
                  </li>
                  <li className={currentPath === "history" ? "active" : ""}>
                    <a href="/history">
                      <i class="fa fa-history mx-1" aria-hidden="true"></i>
                      History
                    </a>
                  </li>
                  <li className={currentPath === "course" ? "active" : ""}>
                    <a href="/course">
                      <i
                        class="fa fa-camera-retro mx-1"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      ></i>
                      Courses
                    </a>
                  </li>
                  <li className={currentPath === "guide" ? "active" : ""}>
                    <a href="/guide">
                      <i
                        class="fa fa-map-signs mx-1"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      ></i>
                      Guide
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
