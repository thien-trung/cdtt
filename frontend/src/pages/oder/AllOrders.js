import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOrders = () => {
    const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
    const [error, setError] = useState(''); // State để lưu lỗi (nếu có)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Gửi yêu cầu GET tới API để lấy danh sách đơn hàng
                const response = await axios.get('http://127.0.0.1:8000/api/abate/getAll');
                setOrders(response.data); // Lưu danh sách đơn hàng vào state
                setError(''); // Xóa lỗi nếu có
            } catch (err) {
                setError('Không thể lấy danh sách đơn hàng'); // Nếu có lỗi
                console.error(err);
            }
        };

        fetchOrders(); // Gọi hàm fetchOrders khi component được mount
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Đơn hàng đã thanh toán</h2>

            {/* Hiển thị lỗi nếu có */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* Hiển thị danh sách đơn hàng */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Tên khách hàng</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Mã đơn hàng</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Số điện thoại</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Tổng tiền</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Địa chỉ</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Sản phẩm</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.phone}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.email}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.totalMoney} VND</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{order.address}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                    {/* Hiển thị danh sách sản phẩm cho đơn hàng */}
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                        {JSON.parse(order.products).map((product, index) => (
                                            <li key={index} style={{ margin: '5px 0' }}>
                                                {product.name} (x{product.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '10px' }}>Không có đơn hàng nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllOrders;
