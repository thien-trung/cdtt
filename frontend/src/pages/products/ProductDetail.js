import React, { Component } from "react";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Api } from "../api/Api";
function withRouter(Component) {
    function ComponentWithRouterProps(props) {
        const params = useParams();
        return <Component {...props} params={params} />;
    }
    return ComponentWithRouterProps;
}
class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            loading: true,
            cartLoading: false,
            cartButtonInit: true,
            productId: "",
            product: "",
            stocks: [],
            selectedSize: "",
            selectedColor: "",
            cartCount: "",
            quantity: 1,
            avaibleQuantity: "",
            settings: {
                dots: true,
                arrows: false,
                infinite: true,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        };
    }
    getProduct(id) {
        this.setState({ loading: true });
        console.log("Fetching product with ID:", id);
        axios
            .get(`${Api}/products/${id}`)
            .then((response) => {
                console.log("API call successful:", response);
                this.setState({
                    productId: id,
                    product: response.data,
                    stocks: [...response.data.stocks],
                    loading: false,
                });
            }).catch((error) => {
                this.setState({ loading: false });
                console.error("API call failed:", error);
            });
    }
    handleMouseLeave() {
        this.setState({ cartButtonInit: true });
    }
    handleWishlist(e) {
        e.preventDefault();
        if (!localStorage.getItem("token")) {
            this.props.showLogin();
        } else {
            axios
                .post(
                    `${Api}/product/wishlist`,
                    {
                        productId: e.target.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.status === 200) {
                        this.props.updateWishlistCount(response.data);
                        this.props.showToast("Added to wishlist!");
                    }
                })
                .catch((error) => {
                    this.props.showToast("Product is already in the wishlist!");
                });
        }
    }
    componentDidMount() {
        const { productId } = this.props.params; // Accessing productId from params 
        this.getProduct(productId);
    }
    componentDidUpdate(prevProps) {
        const { productId } = this.props.params; // Accessing productId from params
        if (productId !== prevProps.params.productId) {
            this.getProduct(productId);
        }
    }
    render() {
        const { productId } = this.props.params; // Accessing productId from params
        const {
            loading,
            product,
            settings,
            avaibleQuantity,
            quantity,
            cartButtonInit,
            cartLoading,
            stocks,
            selectedSize,
            selectedColor,
        } = this.state;
        if (loading) {
            return <Spinner animation="border" />;
        }
        return (
            <div>
                {/* Breadcrumb Navigation */}
                <div id="breadcrumb" className="section">
                    <div className="container">
                        <ul className="breadcrumb-tree">
                            <li><a href="/">Home</a></li>
                            <li><a href="/">All Categories</a></li>
                            <li><a href="#">Accessories</a></li>
                            <li><a href="#">Headphones</a></li>
                            <li className="active">Product name goes here</li>
                        </ul>
                    </div>
                </div>
        
                <Modal.Body>
                    <div className="section product-detail">
                        <div className="container">
                            <div className="row">
                                {/* Product Image Section */}
                                <div className="col-md-6">
                                    <div id="product-main-img">
                                        <img 
                                            src={product.photo ? require(`../../assets/img/${product.photo}`) : require('../../assets/img/hotdeal.png')} 
                                            alt={product.name} 
                                            className="img-fluid" 
                                        />
                                    </div>
                                </div>
        
                                {/* Product Details Section */}
                                <div className="col-md-6">
                                    <div className="product-details">
                                        <h2 className="product-name">{product.name}</h2>
                                        <div className="product-rating">
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star"></i>
                                            <i className="fa fa-star-o"></i>
                                            <a className="review-link" href="#">10 Review(s) | Add your review</a>
                                        </div>
                                        <h3 className="product-price">${product.price - product.price * 0.1} <del className="product-old-price">${product.price}</del></h3>
                                        <span className="product-available">In Stock</span>
                                        <p className="product-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        
                                        {/* Product Options */}
                                        <div className="product-options">
                                            <label>
                                                Size &nbsp;&nbsp;
                                                <select className="input-select">
                                                    <option value="0">X</option>
                                                </select>
                                            </label>
                                            <label>
                                                &nbsp;&nbsp;Color&nbsp;&nbsp;
                                                <select className="input-select">
                                                    <option value="0">Red</option>
                                                </select>
                                            </label>
                                        </div>
        
                                        {/* Add to Cart Section */}
                                        <div className="add-to-cart">
                                            <div className="qty-label">
                                                Qty
                                                <div className="input-number">
                                                    <input type="number" />
                                                    <span className="qty-up">+</span>
                                                    <span className="qty-down">-</span>
                                                </div>
                                            </div>
                                            <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                        </div>
        
                                        {/* Action Buttons */}
                                        <ul className="product-btns">
                                            <li><a href="#"><i className="fa fa-heart-o"></i> add to wishlist</a></li>
                                            <li><a href="#"><i className="fa fa-exchange"></i> add to compare</a></li>
                                        </ul>
        
                                        {/* Product Links */}
                                        <ul className="product-links">
                                            <li>Category:</li>
                                            <li><a href="#">Headphones</a></li>
                                            <li><a href="#">Accessories</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
        
                            {/* Product Tab Section */}
                            <div className="col-md-12">
                                <div id="product-tab">
                                    <ul className="tab-nav">
                                        <li className="active"><a data-toggle="tab" href="#tab1">Description</a></li>
                                        <li><a data-toggle="tab" href="#tab2">Details</a></li>
                                        <li><a data-toggle="tab" href="#tab3">Reviews (3)</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
        
                {/* Related Products Section */}
                <div className="section related-products">
                    <div className="container">
                        <h3 className="section-title text-center">Related Products</h3>
                        <div className="row">
                            {[...Array(4)].map((_, index) => (
                                <div className="col-md-3 col-xs-6" key={index}>
                                    <div className="product">
                                        <div className="product-img">
                                            <img height="300" width="300" src={product.photo ? require(`../../assets/img/${product.photo}`) : require('../../assets/img/hotdeal.png')} alt={product.name} />
                                            <div className="product-label">
                                                <span className="new">NEW</span>
                                            </div>
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">Category</p>
                                            <h3 className="product-name"><a href="#">Product name goes here</a></h3>
                                            <h4 className="product-price">$980.00 <del className="product-old-price">$990.00</del></h4>
                                            <div className="product-btns">
                                                <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                                                <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                                                <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                                            </div>
                                        </div>
                                        <div className="add-to-cart">
                                            <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
}
export default withRouter(ProductDetail);