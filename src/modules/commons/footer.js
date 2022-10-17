export default function Footer() {
  return (
    <footer class="footer-section" style={{ height: "fit-content" }}>
      <div class="footer__top">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-6">
              <div class="footer__top-call">
                <h5>Need Help? Call us</h5>
                <h2>+8437 369 8822</h2>
              </div>
            </div>
            <div class="col-lg-6 col-md-6">
              <div class="footer__top-auth">
                <h5>Join Now And Improve Your Code Skill</h5>
                <a href="#" class="primary-btn mr-2">
                  Sign in
                </a>
                <a href="#" class="primary-btn sign-up ml-2">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="footer__text set-bg"
        style={{ backgroundImage: "url('/assets/img/footer-bg.png')" }}
      >
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="footer__text-about">
                <div class="footer__logo">
                  <a href="./index.html">
                    <img src="img/logo.png" alt="" />
                  </a>
                </div>
                <p>
                  This product belongs to buidevkhanh, used as a final project
                  at the Institute of Post and Telecommunications Technology.
                  This is an online code judgle system for learning and
                  practicing programming. The template used in the website
                  belongs to Colorlib.{" "}
                </p>
                <div class="footer__social">
                  <a href="https://facebook.com/duckhanh4444">
                    <i class="fa fa-facebook"></i>
                  </a>
                  <a href="https://twitter.com">
                    <i class="fa fa-twitter"></i>
                  </a>
                  <a href="https://youtube.com">
                    <i class="fa fa-youtube-play"></i>
                  </a>
                  <a href="https://instagram.com">
                    <i class="fa fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="col-lg-2 col-md-6 col-sm-6">
              <div class="footer__text-widget">
                <h5>Organization</h5>
                <ul>
                  <li>
                    <a href="https://vmo.group.com">VMO Holdings</a>
                  </li>
                  <li>
                    <a href="https://portal.ptit.com">PTIT</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-2 col-md-6 col-sm-6">
              <div class="footer__text-widget">
                <h5>Features</h5>
                <ul>
                  <li>
                    <a>Judgle system</a>
                  </li>
                  <li>
                    <a>Many languages</a>
                  </li>
                  <li>
                    <a>Contest realtime</a>
                  </li>
                  <li>
                    <a>Online code editor</a>
                  </li>
                  <li>
                    <a>Many courses</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="footer__text-widget">
                <h5>cONTACT US</h5>
                <ul class="footer__widget-info">
                  <li>
                    <span class="fa fa-map-marker"></span> KM10, NguyenTrai
                    Street HaDong,
                    <br />
                    Hanoi - VietNam
                  </li>
                  <li>
                    <span class="fa fa-mobile"></span> 0373698822
                  </li>
                  <li>
                    <span class="fa fa-headphones"></span>{" "}
                    buiduckhanh.dev@gmail.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__text-copyright">
            <a>
              Copyright &copy; {new Date().getFullYear()} All rights reserved |
              This template is made with{" "}
              <i class="fa fa-heart" aria-hidden="true"></i> by{" "}
              <a href="https://colorlib.com" target="_blank">
                Colorlib
              </a>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
