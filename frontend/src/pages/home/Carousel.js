import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Api } from './../api/Api';
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Carousel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			currentCategory: 1,
			categories: [],
			products: [],
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleWishlist = this.handleWishlist.bind(this);
	}

	componentDidMount() {
		this.getCategories();
		this.getProducts(1);
	}

	getCategories() {
		axios
			.get(`${Api}/product/categories`)
			.then(response => {
				this.setState({
					categories: [...response.data],
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	handleWishlist(e) {
		if (!localStorage.getItem('token')) {
			// this.props.showLogin();
			toast.error('Cần đăng nhập!');
		} else {
			axios
				.post(
					`${Api}/product/wishlist`,
					{
						productId: e.target.id,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				)
				.then(response => {
					if (response.status === 200) {
						this.props.updateWishlistCount(response.data);
						this.props.showToast('Added to wishlist!');
						toast.success('Đã thêm sản phẩm vào danh sách yêu thích!');

					}
				})
				.catch(error => {
					this.props.showToast('Product is already in the wishlist!');
					toast.success('Sản phẩm đã có trong danh sách yêu thích!');

				});
		}
	}
	handleClick(e) {
		const id = e.target.id
		if (e.target.className == 'add-to-cart-btn') {
			this.props.showQuickView(id)
		} else if (e.target.className == 'qucik-view q q-primary' || e.target.className == 'fa fa-eye') {
			this.props.showQuickView(id)
		} else {
			e.preventDefault()

			this.getProducts(id)
			this.setState({ currentCategory: id })
		}
	}


	getProducts(categoryId) {
		let query = this.props.id === 1 ? 'new' : 'top-selling';

		this.setState({ loading: true });

		axios
			.get(`${Api}/product/categories/${categoryId}/${query}`)
			.then(response => {
				this.setState({
					products: [...response.data],
					loading: false,
				});
			})
			.catch(error => {	
				console.log(error);
			});
	}

	render() {
		const settings = {
			slidesToShow: 4,
			slidesToScroll: 1,
			autoplay: true,
			infinite: false,
			dots: false,
			arrows: true,
			rows: 1,
			slidesPerRow: 1,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			],
		};

		return (
			<div>
				<div className="section">
					<ToastContainer />
					<div className="container">
						<div className="col">
							<div className="col-md-12">
								<div className="section-title">
									<h3 className="title">{this.props.title}</h3>
									<div className="section-nav">
										<ul className="section-tab-nav tab-nav">
											{this.state.categories.map(category => (
												<li key={category.id} className={category.id === this.state.currentCategory ? 'active' : ''}>
													<a id={category.id} onClick={this.handleClick} data-toggle="tab" href="#">
														{category.name}
													</a>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
							{this.state.loading ? (
								<div className="spinner-container">
									<Spinner animation="border" />
								</div>
							) : (
								<div id="product-container" className="row-lg-12">
									<div className="col">
										<div className="products-tabs">
											<div id={'tab' + this.props.id} className="tab-pane active">
												<div className="products-slick" data-nav={'#slick-nav-' + this.props.id}>
													<Slider {...settings}>
														{this.state.products.map(product => (
															<div key={product.id} className="product">
																<div className="product-img">
																	<img src={require(`../../assets/img/${product.photo}`)} alt={product.photo} />
																	<div className="product-label">
																		{new Date(product.sale_expires).getTime() > new Date().getTime() && (
																			<span className="sale">-{product.sale * 100}%</span>
																		)}
																		{new Date(product.created_at).toDateString() === new Date().toDateString() && (
																			<span className="new">NEW</span>
																		)}
																	</div>
																</div>
																<div className="product-body">
																	<p className="product-category">{product.category.name}</p>
																	<h3 className="product-name">
																		<a href="#">{product.name}</a>
																	</h3>
																	{new Date(product.sale_expires).getTime() > new Date().getTime() ? (
																		<h4 className="product-price">
																			${product.price - product.price * product.sale}
																			<del className="product-old-price">${product.price}</del>
																		</h4>
																	) : (
																		<h4 className="product-price">${product.price}</h4>
																	)}
																	<div className="product-rating">
																		{[...Array(5)].map((_, index) => (
																			<i
																				key={index}
																				className={
																					product.review >= index + 1
																						? 'fa fa-star' : product.review > index && product.review < index + 1
																							? 'fa fa-star-half-o'
																							: 'fa fa-star-o'
																				}
																			></i>
																		))}
																	</div>
																	<div className="product-btns">
																		<Button
																			id={product.id}
																			className="add-to-wishlist"
																			onClick={this.handleWishlist}
																			bsPrefix="q"
																		>
																			<i id={product.id} className="fa fa-heart-o"></i>
																			<span className="tooltipp">add to wishlist</span>
																		</Button>
																		<button className="add-to-compare">
																			<i className="fa fa-exchange"></i>
																			<span className="tooltipp">add to compare</span>
																		</button>
																		<Button id={product.id} className="qucik-view" onClick={this.handleClick} bsPrefix="q"><i id={product.id} onClick={this.handleClick} className="fa fa-eye"></i><span className="tooltipp">quick view</span></Button>
																	</div></div>
																<div className="add-to-cart">
																	<button id={product.id} className="add-to-cart-btn" onClick={this.handleClick}>
																		<i id={product.id} onClick={this.handleClick} className="fa fa-shopping-cart"></i> add to cart
																	</button>
																</div>
															</div>
														))}
													</Slider>
												</div>
												<div id={'slick-nav-' + this.props.id} className="products-slick-nav"></div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div style={{ paddingBottom: 50 }}></div>
			</div>
		);
	}
}


const mapStateToProps = state => {
	return {
		productId: state.product_id,
		showModal: state.show_modal
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showQuickView: ((id) => dispatch({ type: 'QUICKVIEW_CONTROL', value: id })),
		showLogin: (() => dispatch({ type: 'LOGIN_CONTROL', value: true })),
		updateWishlistCount: ((count) => dispatch({ type: 'WISHLIST_COUNT', value: count })),
		showToast: ((msg) => dispatch({ type: 'SHOW_TOAST', value: msg }))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Carousel)