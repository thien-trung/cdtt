import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../../assets/img/dashboard-logo.png'; 
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <div className="container-fluid">
                    <div className='header-logo'>
                        <Link to="/">
                            <img src={logo} alt="Company Logo" /> 
                        </Link>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/product">Quản Lý Sản phẩm</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/category">Quản Lý Thương hiệu</a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link" href="/admin/order">Quản Lý Đơn Hàng</a>
                            </li> */}
                        </ul>
                    </div>
                </div>  
            </nav>
        </div>
    );
};

export default Header;
