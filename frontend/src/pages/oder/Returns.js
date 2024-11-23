import React from 'react';
import { Link } from 'react-router-dom';

const ReturnPage = () => {
    const returnItems = [
        {
            id: 1,
            photo: 'product1.jpg',
            name: 'Sản phẩm A',
            reason: 'Không vừa',
            price: 20.00,
        },
        {
            id: 2,
            photo: 'product2.jpg',
            name: 'Sản phẩm B',
            reason: 'Lỗi sản phẩm',
            price: 30.00,
        },
    ];

    return (
        <div style={{
            maxWidth: '800px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f7f7f7',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Yêu cầu Trả Hàng</h2>
            <p style={{ textAlign: 'center', color: '#555' }}>
                Vui lòng xem lại thông tin sản phẩm bên dưới và chọn lý do bạn muốn trả hàng.
            </p>

            {returnItems.map(item => (
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
                        height="100"
                        width="100"
                        alt={item.name}
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />

                    <div style={{ flexGrow: 1, marginLeft: '15px' }}>
                        <h5 style={{ fontWeight: '600', color: '#333' }}>{item.name}</h5>
                        <div style={{ fontSize: '14px', color: '#555' }}>
                            <strong>Lý do:</strong> {item.reason}
                        </div>
                        <h4 style={{ color: '#dc3545', marginTop: '5px' }}>${item.price.toFixed(2)}</h4>
                    </div>
                </div>
            ))}

            <h4 style={{ marginTop: '20px', color: '#333' }}>Lý do Trả Hàng</h4>
            <select style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                borderRadius: '5px',
                border: '1px solid #ccc',
            }}>
                <option value="">Chọn lý do...</option>
                <option value="Không vừa">Không vừa</option>
                <option value="Lỗi sản phẩm">Lỗi sản phẩm</option>
                <option value="Không thích">Không thích</option>
                <option value="Khác">Khác</option>
            </select>

            <div style={{ textAlign: 'center' }}>
                <Link to="/order-history" style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                }}>
                    Gửi yêu cầu trả hàng
                </Link>
            </div>
        </div>
    );
};

export default ReturnPage;
