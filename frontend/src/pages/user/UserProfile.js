import React from 'react';

const MyAccount = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333', fontSize: '2.5em' }}>Tài Khoản Của Tôi</h1>
                <p style={{ color: '#555', fontSize: '1.2em' }}>Quản lý thông tin cá nhân và đơn hàng của bạn.</p>
            </header>

            <section style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '2em' }}>Thông Tin Cá Nhân</h2>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <p><strong>Họ và Tên:</strong> Nguyễn Văn A</p>
                    <p><strong>Email:</strong> nguyenvana@example.com</p>
                    <p><strong>Số Điện Thoại:</strong> (012) 345-6789</p>
                    <p><strong>Địa Chỉ:</strong> 123 Đường Thời Trang, Thành Phố Thời Trang</p>
                </div>
            </section>



            <section style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '2em' }}>Thay Đổi Mật Khẩu</h2>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <form>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu hiện tại:</label>
                            <input type="password" placeholder="Nhập mật khẩu hiện tại" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu mới:</label>
                            <input type="password" placeholder="Nhập mật khẩu mới" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Xác nhận mật khẩu mới:</label>
                            <input type="password" placeholder="Xác nhận mật khẩu mới" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} required />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cập Nhật Mật Khẩu</button>
                    </form>
                </div>
            </section>

            <footer style={{ textAlign: 'center', marginTop: '30px', color: '#777' }}>
                <p>&copy; {new Date().getFullYear()} Shop Thời Trang. Tất cả quyền được bảo lưu.</p>
            </footer>
        </div>
    );
};

export default MyAccount;
