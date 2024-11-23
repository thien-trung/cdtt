import React from "react";

const Footer = () => (
  <footer id="footer">
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Giới thiệu</h3>
              <p>nguyen duong</p>
              <ul className="footer-links">
                <li>
                  <a href="stst">
                    <i className="fa fa-map-marker"></i> 26 tăng nhơn phú
                  </a>
                </li>
                <li>
                  <a href="st">
                    <i className="fa fa-phone"></i> +84: 372979543
                  </a>
                </li>
                <li>
                  <a href="st">
                    <i className="fa fa-envelope-o"></i>nguyenduong@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Ngành hàng</h3>
              <ul className="footer-links">
                <li>
                  <a href="st">Thời Trang nam</a>
                </li>
                <li>
                  <a href="st">Thời Trang Nữ</a>
                </li>
                <li>
                  <a href="st">Thời Trang Trẻ Em</a>
                </li>
                <li>
                  <a href="st">Phụ kiện</a>
                </li>
                <li>
                  <a href="st">Khuyến mãi</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Liên hệ</h3>
              <ul className="footer-links">
                <li>
                  <a href="st">Giới thiệu</a>
                </li>
                <li>
                  <a href="st">Liên hệ</a>
                </li>
                <li>
                  <a href="st">Chính sách mua hàng</a>
                </li>
                <li>
                  <a href="st">Mua hàng</a>
                </li>
                <li>
                  <a href="st">Điều khoản dịch vụ</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Dịch vụ</h3>
              <ul className="footer-links">
                <li>
                  <a href="st">Tài khoản</a>
                </li>
                <li>
                  <a href="st">Giỏ hàng</a>
                </li>
                <li>
                  <a href="st">Ưa thích</a>
                </li>
                <li>
                  <a href="st">Theo dõi đơn hàng</a>
                </li>
                <li>
                  <a href="st">Trợ giúp</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /row */}
      </div>
      {/* /container */}
    </div>
    {/* /top footer */}

    <div id="bottom-footer" className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <ul className="footer-payments">
              <li>
                <a href="st">
                  <i className="fa fa-cc-visa"></i>
                </a>
              </li>
              <li>
                <a href="st">
                  <i className="fa fa-credit-card"></i>
                </a>
              </li>
              <li>
                <a href="st">
                  <i className="fa fa-cc-paypal"></i>
                </a>
              </li>
              <li>
                <a href="st">
                  <i className="fa fa-cc-mastercard"></i>
                </a>
              </li>
              <li>
                <a href="st">
                  <i className="fa fa-cc-discover"></i>
                </a>
              </li>
              <li>
                <a href="st">
                  <i className="fa fa-cc-amex"></i>
                </a>
              </li>
            </ul>
            <span className="copyright">
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script>
              All rights reserved | This template is made with{" "}
              <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
              <a href="https://colorlib.com" target="_blank">
              Quoc Duong
                </a>
            </span>
          </div>
        </div>
      </div>
    </div>
    {/* /bottom footer */}
  </footer>
);

export default Footer;
