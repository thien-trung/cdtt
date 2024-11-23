import React from 'react';
const Collections = () => (
    <div className="section">
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img src={require("../../assets/img/shop01.png")} alt="" />
                        </div>
                        <div className="shop-body">
                            <h3>Thời Trang Nữ<br /> </h3>
                            <a href="#" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img src={require("../../assets/img/product16.png")} alt="" />
                        </div>
                        <div className="shop-body">
                            <h3>Thời Trang Nam<br /></h3>
                            <a href="#" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-xs-6">
                    <div className="shop">
                        <div className="shop-img">
                            <img src={require("../../assets/img/product22.png")} alt="" />
                        </div>
                        <div className="shop-body">
                            <h3>Thời Trang Trẻ Em<br /> </h3>
                            <a href="#" className="cta-btn">Mua ngay <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
export default Collections
