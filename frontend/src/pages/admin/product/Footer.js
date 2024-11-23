import React from 'react';

const Footer = () => (
  <footer id="footer">
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Giới thiệu</h3>
              <p>tranthientrung</p>
              <ul className="footer-links">
                <li><a href="#"><i className="fa fa-map-marker"></i> 120 Tang Nhon Phu</a></li>
                <li><a href="#"><i className="fa fa-phone"></i> +8484-000000000</a></li>
                <li><a href="#"><i className="fa fa-envelope-o"></i> info@tranthientrung.com</a></li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Ngành hàng</h3>
              <ul className="footer-links">
                <li><a href="#">Điện thoại</a></li>
                <li><a href="#">Tablet</a></li>
                <li><a href="#">Laptop</a></li>
                <li><a href="#">Đồng hồ</a></li>
                <li><a href="#">Phụ kiện</a></li>
                <li><a href="#">Khuyến mãi</a></li>
              </ul>
            </div>
          </div>

     
          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Liên hệ</h3>
              <ul className="footer-links">
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Liên hệ</a></li>
                <li><a href="#">Chính sách mua hàng</a></li>
                <li><a href="#">Mua hàng</a></li>
                <li><a href="#">Điều khoản dịch vụ</a></li>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-xs-6">
            <div className="footer">
              <h3 className="footer-title">Dịch vụ</h3>
              <ul className="footer-links">
                <li><a href="#">Tài khoản</a></li>
                <li><a href="#">Giỏ hàng</a></li>
                <li><a href="#">Ưa thích</a></li>
                <li><a href="#">Theo dõi đơn hàng</a></li>
                <li><a href="#">Trợ giúp</a></li>
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
              <li><a href="#"><i className="fa fa-cc-visa"></i></a></li>
              <li><a href="#"><i className="fa fa-credit-card"></i></a></li>
              <li><a href="#"><i className="fa fa-cc-paypal"></i></a></li>
              <li><a href="#"><i className="fa fa-cc-mastercard"></i></a></li>
              <li><a href="#"><i className="fa fa-cc-discover"></i></a></li>
              <li><a href="#"><i className="fa fa-cc-amex"></i></a></li>
            </ul>
            <span className="copyright">
              Copyright &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              All rights reserved | This template is made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
            </span>
          </div>
        </div>
      </div>
    </div>
    {/* /bottom footer */}
  </footer>
);

export default Footer;
