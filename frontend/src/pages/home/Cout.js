import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { Api } from './../api/Api';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            address: '',
            total: 0,
            redirect: false,
            checkoutList: [],
            provinces: '',
            district: '',
            wards: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('selectedList')) {
            if (localStorage.getItem('token')) {
                this.getShoppingCartList();
            } else {
                this.getGuestShoppingCartList(localStorage.getItem('cartList'));
            }
        } else {
            if (!localStorage.getItem('checkoutList')) {
                this.setState({ redirect: true });
            } else {
                const list = JSON.parse(localStorage.getItem('checkoutList'));
                const total = parseFloat(localStorage.getItem('total')) || 0;  
                this.setState({ checkoutList: list, total }, () => {
                    if (!localStorage.getItem('total')) {
                        this.calcTotal(list);
                    }
                });
                if (localStorage.getItem('token') && !this.props.user) {
                    this.getAuth(localStorage.getItem('token'));
                }
            }
        }
        this.calcTotal();
    }

    componentDidUpdate(prevProps) {
        if (this.props.user && this.props.user !== 'guest') {
            if (prevProps.user.id !== this.props.user.id) {
                this.getUserDefaultAddress();
            }
        }
    }

    getAuth(token) {
        axios.get(`${Api}/auth`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(result => {
            this.props.addUser(result.data.user);
            if (result.data.user.address_id)
                this.getUserDefaultAddress();
        });
    }

    getShoppingCartList() {
        axios.get(`${Api}/product/cart-list/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => {
            this.setState({
                checkoutList: [...response.data],
            });
            this.generateCheckoutList();
            this.getUserDefaultAddress();
        }).catch(function (error) {
            console.log(error);
        });
    }

    getGuestShoppingCartList(localCartList) {
        axios.post(`${Api}/product/cart-list/guest`, {
            cartList: localCartList,
        }).then((response) => {
            this.setState({
                checkoutList: [...response.data],
            });
            this.generateCheckoutList();
        });
    }

    generateCheckoutList() {
        let checkoutList = this.state.checkoutList;
        let selectedList = JSON.parse(localStorage.getItem('selectedList'));

        if (localStorage.getItem('token')) {
            checkoutList = checkoutList.filter((item) => selectedList.includes(item.id));
        } else {
            checkoutList = checkoutList.filter((item, index) => selectedList.includes(index + 1));
        }

        localStorage.setItem('checkoutList', JSON.stringify(checkoutList));
        localStorage.removeItem('selectedList');

        this.setState({ checkoutList: [...checkoutList] });
        this.calcTotal(checkoutList);
    }

    calcTotal() {
        const total = parseFloat(localStorage.getItem('total')) || 0;
        this.setState({ total });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    }



    handlePayment = async () => {
        const { name, phone, email, total, checkoutList, provinces, district, wards, address } = this.state;

        // Kiểm tra các trường cần thiết
        if (!name || !phone || !email || !address || !provinces || !district || !wards) {
            alert("Vui lòng điền tất cả các trường cần thiết.");
            return;
        }

        // Tạo đối tượng abate
        const abate = {
            name,
            phone,
            email,
            products: checkoutList.map(item => ({
                name: item.stock.product.name,
                quantity: item.quantity,
                price: item.stock.product.price,
            })),
            totalMoney: total,
            provinces,
            district,
            wards,
            address,
        };

        try {
            const response = await axios.post(`${Api}/abate`, abate); // Gửi abate làm yêu cầu

            console.log('Payment successful:', response.data.message);
            this.setState({ redirect: true });
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert('Đã xảy ra lỗi khi thanh toán: ' + error.response.data.message);
            } else {
                console.error('Error message:', error.message);
                alert('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại!');
            }
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to='/' />;
        }

        return (
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="billing-details">
                                    <div className="section-title">
                                        <h3 className="title">Thông tin thanh toán</h3>
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.name} type="text" name="name" placeholder="Họ và tên" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.phone} type="text" name="phone" placeholder="Số điện thoại" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.email} type="email" name="email" placeholder="Email" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.address} type="text" name="address" placeholder="Địa chỉ" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.provinces} type="text" name="provinces" placeholder="Tỉnh/Thành phố" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.district} type="text" name="district" placeholder="Quận/Huyện" required />
                                    </div>
                                    <div className="form-group">
                                        <input className="input" onChange={this.handleChange} value={this.state.wards} type="text" name="wards" placeholder="Phường/Xã" required />
                                    </div>
                                    <button className="btn" type="button" onClick={this.handlePayment}>Thanh toán</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-5">
                            <div className="order-details">
                                <h3 className="title">Chi tiết đơn hàng</h3>
                                <table className="shopping-cart-table table">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.checkoutList.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.stock.product.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${(item.quantity * item.stock.product.price).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td><strong>Tổng cộng:</strong></td>
                                            <td></td>
                                            <td>${this.state.total.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    shoppingCart: state.shoppingCart || [],
});

const mapDispatchToProps = (dispatch) => ({
    addUser: (user) => dispatch({ type: 'ADD_USER', payload: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
