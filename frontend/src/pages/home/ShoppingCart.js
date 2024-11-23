import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import {  Api } from '../api/Api';

class ShoppingCart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: '1',
			loading: false,
			subtotal: 0,
			total: 0,
			cartList: [],
			selectedList: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCheckout = this.handleCheckout.bind(this);
		// this.handleVNPAYCheckout = this.handleVNPAYCheckout.bind(this);

	}

	componentDidMount() {
		const { user } = this.props;
		const savedSubtotal = localStorage.getItem('subtotal');
		const savedTotal = localStorage.getItem('total');
		const savedSelectedList = JSON.parse(localStorage.getItem('selectedList'));

		if (savedSubtotal && savedTotal) {
			this.setState({
				subtotal: parseFloat(savedSubtotal),
				total: parseFloat(savedTotal),
				selectedList: savedSelectedList || [],

			});
		}

		if (user && user !== 'guest') {
			if (user.id !== this.state.userId) {
				this.getAuth(localStorage.getItem('token'));
			}
		} else if (localStorage.getItem('cartList')) {
			this.getGuestShoppingCartList(localStorage.getItem('cartList'));
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { user } = this.props;
		if (user !== prevProps.user) {
			if (user !== 'guest' && user.id !== this.state.userId) {
				this.getAuth(localStorage.getItem('token'));
			} else if (user === 'guest' && this.state.userId !== '') {
				this.getGuestShoppingCartList(localStorage.getItem('cartList'));
			}
		}
	}

	getAuth(token) {
		this.setState({ loading: true });
		axios
			.get(`${Api}/auth`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((result) => {
				this.setState({ userId: result.data.user.id });
				if (localStorage.getItem('cartList')) {
					this.saveToShoppingCart(localStorage.getItem('cartList'));
				} else {
					this.getShoppingCartList(result.data.user.id);
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				if (localStorage.getItem('cartList')) {
					this.getGuestShoppingCartList(localStorage.getItem('cartList'));
				}
			})
			.finally(() => {
				this.setState({ loading: false });
			});
	}

	getShoppingCartList(userId) {
		this.setState({ loading: true });
		axios
			.get(`${Api}/product/cart-list/`, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			})
			.then((response) => {
				this.setState({
					cartList: response.data,
					loading: false,
				});
				this.props.updateCartCount(response.data.length);
				this.calcTotal(this.state.selectedList);
			})
			.catch((error) => {
				console.error('Error:', error);
				this.setState({ loading: false });
			});
	}

	getGuestShoppingCartList(localCartList) {
		this.setState({ userId: '', loading: true });
		axios
			.post(`${Api}/product/cart-list/guest`, {
				cartList: localCartList,
			})
			.then((response) => {
				this.setState({
					loading: false,
					cartList: response.data,
				});
				this.props.updateCartCount(response.data.length);
				this.calcTotal(this.state.selectedList);
			})
			.catch((error) => {
				console.error('Error:', error);
				this.setState({ loading: false });
			});
	}

	saveToShoppingCart(localCartList) {
		axios
			.post(
				`${Api}/product/cart-list`,
				{ localCartList },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			)
			.then((response) => {
				this.getShoppingCartList(this.state.userId);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	handleChange(e) {
		const { id, type, className, value } = e.target;

		if (type === 'checkbox') {
			let updatedSelectedList = [...this.state.selectedList];

			if (id === '0') {
				if (this.state.selectedList.length === this.state.cartList.length) {
					updatedSelectedList = [];
				} else {
					updatedSelectedList = this.state.cartList.map((item) => item.id);
				}
			} else {
				if (updatedSelectedList.includes(parseInt(id))) {
					updatedSelectedList = updatedSelectedList.filter((item) => item !== parseInt(id));
				} else {
					updatedSelectedList.push(parseInt(id));
				}
			}

			this.setState({
				selectedList: updatedSelectedList,
			});

			this.calcTotal(updatedSelectedList);
		} else {
			const updatedCartList = this.state.cartList.map((item) => {
				if (item.id === parseInt(id)) {
					let quantity = item.quantity;

					if (className === 'qty-up') {
						quantity += 1;
					} else if (className === 'qty-down') {
						quantity = Math.max(quantity - 1, 1);
					} else if (type === 'number') {
						quantity = parseInt(value);
					}

					if (quantity <= item.stock.quantity) {
						item.quantity = quantity;
					} else {
						item.quantity = item.stock.quantity;
					}
				}
				return item;
			});

			this.setState({ cartList: updatedCartList });

			axios
				.put(`${Api}/product/cart-list/${id}`, { quantity: updatedCartList.find((item) => item.id === parseInt(id)).quantity })
				.then((response) => {
					this.calcTotal(this.state.selectedList);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	}

	calcTotal(selectedList) {
		let subtotal = 0;

		this.state.cartList.forEach((item) => {
			if (selectedList.includes(item.id)) {
				subtotal += item.stock.product.price * item.quantity;
			}
		});

		this.setState({
			subtotal: subtotal,
			total: subtotal,
		});
		localStorage.setItem('subtotal', subtotal.toFixed(2));
		localStorage.setItem('total', subtotal.toFixed(2));
	}

	handleDelete(e) {
		const id = parseInt(e.target.id);

		if (this.state.userId) {
			axios
				.delete(`${Api}/product/cart-list/${id}`, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				})
				.then((response) => {
					const updatedSelectedList = this.state.selectedList.filter((item) => item !== id);
					this.calcTotal(updatedSelectedList);
					this.setState({ selectedList: updatedSelectedList });

					if (localStorage.getItem('cartList')) {
						let items = JSON.parse(localStorage.getItem('cartList'));
						items = items.filter((item) => item[0].stock_id !== response.data.stock_id && item[0].userId !== response.data.user_id);
						localStorage.setItem('cartList', JSON.stringify(items));
					}

					this.getShoppingCartList(this.state.userId);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		} else {
			let items = JSON.parse(localStorage.getItem('cartList'));
			items = items.filter((item, index) => index + 1 !== id);

			const updatedSelectedList = this.state.selectedList.filter((item) => item !== id);
			this.setState({ selectedList: updatedSelectedList });

			localStorage.setItem('cartList', JSON.stringify(items));
			this.getGuestShoppingCartList(JSON.stringify(items));

			this.calcTotal(updatedSelectedList);
		}
	}

	handleCheckout(e) {
		const id = parseInt(e.target.id);
		let selectedCheckout = [];

		if (id !== 0) {
			selectedCheckout = [id];
		} else {
			selectedCheckout = this.state.selectedList;
		}

		localStorage.setItem('selectedList', JSON.stringify(selectedCheckout));
		localStorage.setItem('checkoutTotal', this.state.total.toFixed(2));
	}

	// handleVNPAYCheckout = () => {
	// 	axios.post(`${Api}/vnpay`, {
	// 	})
	// 		.then(response => {
	// 			if (response.data.code === '00') {
	// 				window.location.href = response.data.data;
	// 			} else {
	// 				console.log(response.data.message);
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.error('Error:', error);
	// 		});
	// }


	render() {
		const { cartList, loading, subtotal, total, selectedList } = this.state;

		return (
			<React.Fragment>
				{/* BREADCRUMB */}
				<div id="breadcrumb" className="section">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<ul className="breadcrumb-tree">
								</ul>
							</div>
						</div>
					</div>
				</div>
				{/* /BREADCRUMB */}

				{/* SECTION */}
				<div className="section">
					<div className="container">
						<div className="row">
							{/* Orders */}
							<div className="col-md-7 cart-items">
								<div className="section-title cart-item">
									<h3 className="title">Shopping Cart {cartList.length > 0 && `(${cartList.length})`}</h3>
									<div className="checkbox-select-all">
										<div className="input-checkbox">
											<input
												name="selectAll"
												type="checkbox"
												id={0}
												checked={cartList.length > 0 && selectedList.length === cartList.length}
												onChange={this.handleChange}
											/>
											<label htmlFor={0} className="px-4">
												<span></span>
												Select All
											</label>
										</div>
									</div>
								</div>

								{/* Cart Items */}
								{loading ? (
									<div className="spinner-container">
										<Spinner animation="border" />
									</div>
								) : (
									cartList.map((item) => (
										<div key={item.id} className="cart-item">
											<div className="media cart-item-box">
												<div className="input-checkbox">
													<input
														type="checkbox"
														id={item.id}
														checked={selectedList.includes(item.id)}
														onChange={this.handleChange}
													/>
													<label htmlFor={item.id}>
														<span></span>
													</label>
												</div>

												{/* <img height="100" width="100"
												 className="align-self-start mr-3"
												  src={`${ImageApi}/img/${item.stock.product.photo}`} 
												  alt={item.stock.product.photo} 
												/> */}

													<img
													height="100" width="100"
														className="align-self-start mr-3"
														src={require(`../../../public/img/${item.stock.product.photo}`)} // Sử dụng require để lấy ảnh
														alt={item.stock.product.photo} // Chỉ cần sử dụng tên ảnh
													/>

												<div className="media-body cart-item-body">
													<h5 className="mt-0 product-name">
														<Link to={`/products/${item.stock.product.id}`}>
															{item.stock.product.name}
														</Link>
													</h5>
													<div>
														<div>
															<strong>Size:</strong> {item.stock.size}{' '}
															<strong>Color:</strong> {item.stock.color}
															<div className="buy-item">
																<div className="qty-label">
																	Qty
																	<div className="input-number">
																		<input
																			id={item.id}
																			type="number"
																			value={item.quantity}
																			onChange={this.handleChange}
																		/>
																		<span
																			id={item.id}
																			className="qty-up"
																			onClick={this.handleChange}
																		>
																			+
																		</span>
																		<span
																			id={item.id}
																			className="qty-down"
																			onClick={this.handleChange}
																		>
																			-
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div>
														<sub>
															<strong>Free Shipping</strong>
														</sub>
													</div>
													<h4 className="product-price">${item.stock.product.price}</h4>
												</div>
												<div className="delete-icon">
													<i id={item.id} onClick={this.handleDelete} className="fa fa-trash" aria-hidden="true"></i>
												</div>
											</div>
										</div>
									))
								)}
								{/* /Cart Items */}
							</div>
							{/* /Orders */}

							{/* Order Summary */}
							<div className="col-md-4 cart-details">
								<div className="section-title text-center">
									<h3 className="title">Order Summary</h3>
								</div>
								<div className="cart-summary">
									<div className="order-col">
										<div>Subtotal</div>
										<div>${subtotal.toFixed(2)}</div>
									</div>
									<div className="order-col">
										<div>Shipping</div>
										<div>
											<strong>FREE</strong>
										</div>
									</div>
									<hr />
									<div className="order-col">
										<div>
											<strong>TOTAL</strong>
										</div>
										<div>
											<strong className={selectedList.length !== 0 ? 'order-total' : 'order-total-disabled'}>
												${total.toFixed(2)}
											</strong>
										</div>
									</div>
								</div>
								<Link
									id={0}
									onClick={this.handleCheckout}
									to={'/checkout'}
									className={selectedList.length !== 0 ? 'primary-btn order-submit' : 'primary-btn order-submit-disabled'}
								>
									Checkout {selectedList.length !== 0 && `(${selectedList.length})`}
								</Link>
								{/* Vi vnpay
								<button onClick={this.handleVNPAYCheckout} className="btn btn-success">
									VNPAY Checkout
								</button> */}


							</div>


							{/* /Order Summary */}
						</div>
						{/* /row */}
					</div>
					{/* /container */}
				</div>
				{/* /SECTION */}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user_data,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateCartCount: (cartCount) => dispatch({ type: 'CART_COUNT', value: cartCount }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);