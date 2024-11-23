import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Spinner } from 'react-bootstrap';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Pay = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [totalMoney, setTotalMoney] = useState(0);
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [address, setAddress] = useState("");
    const fee = 40000; // Fixed fee

    // Overlay style
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "address":
                setAddress(value);
                break;
            default:
                break;
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Prepare products data for submission
        const products = selectedItems.map(item => ({
            id: item.id,
            photo: item.photo,
            quantity: item.quantity,
            price: item.price * item.quantity,
        }));

        // POST request to create an order
        axios.post("http://127.0.0.1:8000/api/abate", {
            name,
            phone,
            email,
            products,
            totalMoney,
            provinces: province,
            district,
            wards: ward,
            address
        })
        .then(() => {
            // Handle success case
            setIsLoading(true);
            // Add confetti and further processing here...
        })
        .catch((err) => {
            // Handle error case
            console.error(err);
            setErrorMessage("Đặt hàng không thành công. Vui lòng thử lại!");
        });
    };

    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };

    useEffect(() => {
        setTotalMoney(totalAmount + fee); // Update totalMoney with fee
    }, [totalAmount, fee]);

    // Fetch provinces data
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts based on selected province
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(response.data.data);
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);

    // Fetch wards based on selected district
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(response.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    return (
        <>
            <Form className="abate" onSubmit={handleSubmit}>
                <div className="Pay container">
                    {isLoading && (
                        <div style={overlayStyle}>
                            <Spinner animation="border" variant="light" />
                        </div>
                    )}
                    <div className="row">
                        <div className="col-8">
                            <div className="main-header">
                                <h2>Thanh Toán</h2>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="my-3"><b>Thông tin người nhận</b></div>
                                    <div className="mb-3">
                                        <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="Nhập email" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="name" className="form-control" onChange={handleChange} placeholder="Nhập Họ Tên" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="phone" className="form-control" onChange={handleChange} placeholder="Số điện thoại" />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                setSelectedProvince(e.target.value);
                                                setProvince(e.target.options[e.target.selectedIndex].text); // Set province name
                                            }}
                                        >
                                            <option value="">Chọn Tỉnh, Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>{province.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedDistrict}
                                            onChange={(e) => {
                                                setSelectedDistrict(e.target.value);
                                                setDistrict(e.target.options[e.target.selectedIndex].text); // Set district name
                                            }}
                                        >
                                            <option value="">Chọn Quận, Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedWard}
                                            onChange={(e) => {
                                                setSelectedWard(e.target.value);
                                                setWard(e.target.options[e.target.selectedIndex].text); // Set ward name
                                            }}
                                        >
                                            <option value="">Chọn Phường, Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>{ward.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <textarea rows="4" name="address" onChange={handleChange} className="form-control" placeholder="Nhập địa chỉ cần giao..." />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="my-3"><b>Vận chuyển</b></div>
                                    {selectedItems.length > 0 ? (
                                        <div className="ship-cod form-control">
                                            <div className="ship">
                                                <input type="radio" checked readOnly />
                                                Giao hàng tận nơi
                                            </div>
                                            <span className="cod">{formatCurrency(fee)}</span>
                                        </div>
                                    ) : (
                                        <span className="null form-control">Vui lòng nhập thông tin giao hàng</span>
                                    )}
                                    <div className="my-3"><b>Thanh toán</b></div>
                                    <div className="method ">
                                        <div className="method-cash form-control">
                                            <div className="cash">
                                                <input type="radio" id="cash" name="fav_language" />
                                                <label htmlFor="cash">Tiền mặt</label>
                                            </div>
                                        </div>
                                        <div className="method-transfer mt-2 form-control">
                                            <div className="transfer">
                                                <input type="radio" id="transfer" name="fav_language" />
                                                <label htmlFor="transfer">Chuyển khoản</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4" style={{ height: "730px", width: "400px", borderLeft: "3px solid lightgray" }}>
                            <div className="order container">
                                <div className="container">
                                    <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>Thông tin thanh toán</p>
                                    <div className="order-summary">
                                        <p>Sản phẩm đã chọn:</p>
                                        {selectedItems.length === 0 ? (
                                            <p>Không có sản phẩm nào được chọn.</p>
                                        ) : (
                                            <ul>
                                                {selectedItems.map((item, index) => (
                                                    <React.Fragment key={`${item.id}-${index}`}>
                                                        <hr />
                                                        <li className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={`../../../img/${item.photo}`}
                                                                    alt={item.name}
                                                                    style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                                />
                                                                <div>
                                                                    <span style={{ fontWeight: "bold", width: "200px" }}>{item.name}</span><br />
                                                                    <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>Số lượng: {item.quantity}</span><br />
                                                                </div>
                                                            </div>
                                                            <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>{formatCurrency(item.price * item.quantity)}</span>
                                                        </li>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <p>Tạm tính:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(totalAmount)}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Phí vận chuyển: </p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {selectedItems.length > 0 ? (
                                                    <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(fee)}</strong>
                                                ) : (
                                                    <span>---</span>
                                                )}
                                            </strong>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <p>Tổng tiền:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(totalMoney)}</strong>
                                        </div>
                                        <button className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }}>Thanh toán</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
};

export default Pay;
