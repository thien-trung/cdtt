import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingShipment = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hàm gọi API để lấy danh sách đơn hàng chờ vận chuyển
    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders'); // Cập nhật URL nếu cần
            const pendingOrders = response.data.filter(order => order.status === 'pending'); // Giả định rằng có trường status
            setOrders(pendingOrders);
        } catch (err) {
            setError('Không thể lấy danh sách đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Đơn hàng chờ vận chuyển</h2>
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && orders.length === 0 && <p>Không có đơn hàng đang chờ vận chuyển.</p>}
            {!loading && orders.length > 0 && (
                <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Ngày đặt hàng</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customerName}</td> {/* Cập nhật trường tên khách hàng */}
                                <td>{order.totalMoney}</td> {/* Cập nhật trường tổng tiền */}
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td> {/* Cập nhật trường ngày */}
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingShipment;
