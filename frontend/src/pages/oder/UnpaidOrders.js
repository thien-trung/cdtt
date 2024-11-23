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
	render() {
		const { cartList, loading, subtotal, total, selectedList } = this.state;

        return (
            <React.Fragment>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Đơn hàng chưa thanh toán</h2>
            <div id="breadcrumb" style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {/* Breadcrumb items can be added here */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /BREADCRUMB */}
        
                {/* CART SECTION */}
                <div style={{ padding: '10px 0' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                {/* Cart Items */}
                                {loading ? (
                                    <div className="spinner-container">
                                        <Spinner animation="border" />
                                    </div>
                                ) : (
                                    cartList.map((item) => (
                                        <div key={item.id} style={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            margin: '10px 0',
                                            padding: '15px',
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}>
                                            <img
                                                height="100" width="100"
                                                src={require(`../../../public/img/${item.stock.product.photo}`)} 
                                                alt={item.stock.product.photo}
                                                style={{ borderRadius: '8px' }}
                                            />
        
                                            <div style={{ flexGrow: 1, marginLeft: '10px' }}>
                                                <h5 style={{ fontWeight: 'bold' }}>
                                                    <Link to={`/products/${item.stock.product.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                                                        {item.stock.product.name}
                                                    </Link>
                                                </h5>
                                                <div>
                                                    <strong>Size:</strong> {item.stock.size} 
                                                    <strong> | Color:</strong> {item.stock.color}
                                                </div>
                                                <div>
                                                    <strong style={{ color: '#28a745' }}>Free Shipping</strong>
                                                </div>
                                                <h4 style={{ color: '#dc3545' }}>${item.stock.product.price}</h4>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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