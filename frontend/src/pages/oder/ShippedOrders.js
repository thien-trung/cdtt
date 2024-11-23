import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShippedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hàm gọi API để lấy danh sách đơn hàng đã vận chuyển
    const fetchShippedOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders'); // Cập nhật URL nếu cần
            const shippedOrders = response.data.filter(order => order.status === 'shipped'); // Giả định có trường status
            setOrders(shippedOrders);
        } catch (err) {
            setError('Không thể lấy danh sách đơn hàng đã vận chuyển.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShippedOrders();
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Đơn hàng đã vận chuyển</h2>
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && orders.length === 0 && <p>Không có đơn hàng đã vận chuyển.</p>}
            {!loading && orders.length > 0 && (
                <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Ngày đặt hàng</th>
                            <th>Ngày giao hàng</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer_name}</td>
                                <td>{order.total_money}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>{new Date(order.shipped_at).toLocaleDateString()}</td> {/* Giả định có trường shipped_at */}
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ShippedOrders;
