export default function NavigationBar() {
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
        <nav className="offcanvas__menu mobile-menu">
          <ul>
            <li className="active">
              <a href="./index.html">Home</a>
            </li>
            <li>
              <a href="./about.html">Problem</a>
            </li>
            <li>
              <a href="./hosting.html">Contest</a>
            </li>
            <li>
              <a href="./blog.html">History</a>
            </li>
            <li>
              <a href="./contact.html">Courses</a>
            </li>
            <li>
              <a href="./contact.html">Guide</a>
            </li>
          </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div className="offcanvas__auth">
          <ul>
            <li>
              <a href="#">
                <span className="icon_chat_alt"></span> Live chat
              </a>
            </li>
            <li>
              <a href="#">
                <span className="fa fa-user"></span> Login / Register
              </a>
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
                      <a href="#">
                        <span className="fa fa-user"></span> Login / Register
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <div className="header__logo">
                <a href="./index.html">
                  <img src="img/logo.png" alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-9 col-md-9">
              <nav className="header__menu">
                <ul>
                  <li>
                    <a href="./index.html">Home</a>
                  </li>
                  <li className="active">
                    <a href="./about.html">Problem</a>
                  </li>
                  <li>
                    <a href="./hosting.html">Contest</a>
                  </li>
                  <li>
                    <a href="./blog.html">History</a>
                  </li>
                  <li>
                    <a href="./contact.html">Courses</a>
                  </li>
                  <li>
                    <a href="./contact.html">Guide</a>
                  </li>
                </ul>
              </nav>
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
