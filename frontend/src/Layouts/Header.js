import React, { Component } from "react";
import { Link } from "react-router-dom";
import Authentification from "./../pages/auth/Authentification";
import axios from "axios";
import { connect } from "react-redux";
import { Api } from "./../pages/api/Api";
import CartPreview from "./../pages/home/CartPreview";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemCount: 0,
      wishlistCount: 0,
    };
  }
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.getShoppingCartCount();
      this.getWishlistCount();
    } else if (localStorage.getItem("cartList")) {
      this.props.updateCartCount(
        JSON.parse(localStorage.getItem("cartList")).length
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.cartCount !== prevProps.cartCount) {
      if (localStorage.getItem("token")) {
        this.getShoppingCartCount();
      } else if (localStorage.getItem("cartList")) {
        this.props.updateCartCount(
          JSON.parse(localStorage.getItem("cartList")).length
        );
      }
    }

    if (this.props.wishlistCount !== prevProps.wishlistCount) {
      if (localStorage.getItem("token")) {
        this.getWishlistCount();
      }
    }
  }

  async getShoppingCartCount() {
    try {
      const result = await axios.get(`${Api}/product/cart-list/count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const localCartList = JSON.parse(localStorage.getItem("cartList")) || [];
      const stockList = localCartList.map((list) => list[0].stock_id);

      const cartList = [...stockList, ...result.data];
      const uniqueCartList = [...new Set(cartList)];

      this.setState({ cartItemCount: uniqueCartList.length });
      this.props.updateCartCount(uniqueCartList.length);
    } catch (error) {
      console.error(error);
    }
  }

  async getWishlistCount() {
    try {
      const result = await axios.get(`${Api}/product/wishlist/count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      this.setState({ wishlistCount: result.data });
      this.props.updateWishlistCount(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <header>
        {/* TOP HEADER */}
        <div id="top-header">
          <div className="container">
            <ul className="header-links">
              <li>
                <a href="tel:+84-392445255">
                  <i className="fa fa-phone"></i> +84-372979543
                </a>
              </li>
              <li>
                <a href="mailto:nguyenquocduong@gmail.com">
                  <i className="fa fa-envelope-o"></i> nguyenduong@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/YYuDUgvMT6Jpgq4p7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-map-marker"></i> 26 tăng nhơn phú
                </a>
              </li>
            </ul>
            <ul className="header-links">
              <li style={{ display: "flex", alignItems: "center" }}>
                <a
                  href="st"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                >
                  <i className="fa fa-money"></i> VND
                </a>
                <Authentification />
              </li>
            </ul>
          </div>
        </div>
        {/* MAIN HEADER */}
        <div id="header">
          <div className="container">
            <div className="row">
              {/* LOGO */}
              <div className="col-md-3">
                <div className="header-logo">
                  <Link to="/">
                    <img
                      src={require("../assets/img/dashboard-logo.png")}
                      alt="Company Logo"
                    />
                  </Link>
                </div>
              </div>
              {/* SEARCH BAR */}
              <div className="col-md-6">
                <div className="header-search">
                  <form>
                    <select className="input-select">
                      <option value="0">Tất cả sản phẩm</option>
                      <option value="1">Thời trang nam</option>
                      <option value="2">Thời trang nam</option>
                      <option value="3">Thời trang trẻ em</option>
                    </select>
                    <input className="input" placeholder="Tìm kiếm sản phẩm" />
                    <button className="search-btn">Tìm kiếm</button>
                  </form>
                </div>
              </div>
              {/* ACCOUNT */}
              <div className="col-md-3">
                <div className="header-ctn">
                  {/* Wishlist */}
                  <div>
                    <Link to="/wishlist">
                      <i className="fa fa-heart"></i>
                      <span>Yêu thích</span>
                      {this.props.wishlistCount > 0 && (
                        <div className="qty">{this.props.wishlistCount}</div>
                      )}
                    </Link>
                  </div>
                  {/* Cart */}
                  <div className="dropdown">
                    <Link className="dropdown-toggle" to="/shopping-cart">
                      <i className="fa fa-shopping-cart"></i>
                      <span>Giỏ hàng</span>
                      {this.props.cartCount > 0 && (
                        <div className="qty">{this.props.cartCount}</div>
                      )}
                    </Link>
                    <CartPreview />
                  </div>
                  {/* Menu Toggle */}
                  <div className="menu-toggle">
                    <a href="st">
                      <i className="fa fa-bars"></i>
                      <span>Menu</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* ACCOUNT */}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartCount: state.cart_count,
    wishlistCount: state.wishlist_count,
    userData: state.user_data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartCount: (count) => dispatch({ type: "CART_COUNT", value: count }),
    updateWishlistCount: (count) =>
      dispatch({ type: "WISHLIST_COUNT", value: count }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
