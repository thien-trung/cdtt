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
            // Gửi abate làm yêu cầu thanh toán
            const paymentResponse = await axios.post(`${Api}/abate`, abate);
    
            console.log('Thanh toán thành công:', paymentResponse.data.message);
    
            // Xóa từng sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
            for (const product of checkoutList) {
                await axios.delete(`http://127.0.0.1:8000/api/product/cart-list/${product.id}`);
                console.log(`Sản phẩm ${product.stock.product.name} đã bị xóa khỏi giỏ hàng.`);
            }
    
            // Chuyển hướng sau khi thanh toán và xóa giỏ hàng thành công
            this.setState({ redirect: true });
        } catch (error) {
            if (error.response) {
                console.error('Lỗi từ server:', error.response.data);
                alert('Đã xảy ra lỗi khi thanh toán: ' + error.response.data.message);
            } else {
                console.error('Lỗi mạng hoặc yêu cầu:', error.message);
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
                                    <div className="method ">
                                        <div className="method-cash form-control">
                                            <div className="cash">
                                                <input type="radio" id="cash" name="fav_language" />
                                                <label htmlFor="cash">Tiền mặt</label>
                                            </div>
                                        </div>
                                        <div className="method-transfer  form-control">
                                            <div className="transfer">
                                                <input type="radio" id="transfer" name="fav_language" />
                                                <label htmlFor="transfer">Chuyển khoản</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '10px'}} type="button" onClick={this.handlePayment}>Thanh toán</button>

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
