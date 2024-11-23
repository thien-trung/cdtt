import React from 'react';
import {Link } from 'react-router-dom';

const Navv = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '950px',maxHeight:'-50px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
    <nav id="navigation" style={{ textAlign: 'center' }}>
        <div className="container">
            <div id="responsive-nav">
                <ul className="main-nav nav nav-navbar">
                    <li><Link to="/oder/all-orders" style={{ margin: '0 15px', textDecoration: 'none',    }}>Đơn hàng đã thanh toán</Link></li> 
                    <li><Link to="/oder/unpaid-orders" style={{ margin: '0 15px', textDecoration: 'none',    }}>Đơn hàng chưa thanh toán</Link></li> 
                    <li><Link to="/oder/pending-shipment" style={{ margin: '0 15px', textDecoration: 'none',    }}>Chờ vận chuyển</Link></li> 
                    <li><Link to="/oder/shipped-orders" style={{ margin: '0 15px', textDecoration: 'none',    }}>Đã vận chuyển</Link></li> 
                    <li><Link to="/oder/returns" style={{ margin: '0 15px', textDecoration: 'none',    }}>Trả hàng</Link></li> 
                </ul>
            </div>
        </div>
    </nav>
        </div>
        
    );
};

export default Navv;
