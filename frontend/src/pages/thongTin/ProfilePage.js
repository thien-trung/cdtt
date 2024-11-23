import React from 'react';

const ShopInfo = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333', fontSize: '2.5em' }}>Chào Mừng Đến Với Shop Thời Trang</h1>
                <p style={{ color: '#555', fontSize: '1.2em' }}>Nơi cung cấp những sản phẩm thời trang chất lượng cho nam, nữ và trẻ em.</p>
            </header>

            <section style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '2em' }}>Về Chúng Tôi</h2>
                <p style={{ lineHeight: '1.6', fontSize: '1.1em' }}>
                    Chúng tôi là một cửa hàng thời trang với sứ mệnh cung cấp những sản phẩm thời trang chất lượng và phong cách nhất cho khách hàng. Tại đây, bạn có thể tìm thấy những bộ sưu tập mới nhất về thời trang nam, nữ và trẻ em.
                </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '2em' }}>Sản Phẩm</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    <div style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center', borderRadius: '8px', width: '30%', margin: '10px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <img src="https://via.placeholder.com/150" alt="Thời Trang Nam" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                        <h3 style={{ color: '#007bff' }}>Thời Trang Nam</h3>
                        <p>Các bộ sưu tập áo sơ mi, quần tây, và phụ kiện thời trang cho nam giới.</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center', borderRadius: '8px', width: '30%', margin: '10px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <img src="https://via.placeholder.com/150" alt="Thời Trang Nữ" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                        <h3 style={{ color: '#007bff' }}>Thời Trang Nữ</h3>
                        <p>Đầm, áo, và nhiều sản phẩm khác cho phụ nữ hiện đại.</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center', borderRadius: '8px', width: '30%', margin: '10px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <img src="https://via.placeholder.com/150" alt="Thời Trang Trẻ Em" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
                        <h3 style={{ color: '#007bff' }}>Thời Trang Trẻ Em</h3>
                        <p>Đảm bảo cho trẻ em luôn phong cách và thoải mái với những bộ quần áo đáng yêu.</p>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#007bff', marginBottom: '10px', fontSize: '2em' }}>Liên Hệ Với Chúng Tôi</h2>
                <p style={{ fontSize: '1.1em' }}>Địa chỉ: 123 Đường Thời Trang, Thành Phố Thời Trang</p>
                <p style={{ fontSize: '1.1em' }}>Số điện thoại: (012) 345-6789</p>
                <p style={{ fontSize: '1.1em' }}>Email: <a href="mailto:info@shopthoitran.com" style={{ color: '#007bff' }}>info@shopthoitran.com</a></p>
            </section>

            <footer style={{ textAlign: 'center', marginTop: '30px', color: '#777' }}>
                <p>&copy; {new Date().getFullYear()} Shop Thời Trang. Tất cả quyền được bảo lưu.</p>
            </footer>
        </div>
    );
};

export default ShopInfo;
