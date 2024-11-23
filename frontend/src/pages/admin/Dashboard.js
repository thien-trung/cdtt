import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Footer from './product/Footer';
import Header from '../admin/product/Header';

const Dashboard = () => {
    return (
        
        <div>
            <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(50vh - 56px)' }}>
                <h1 className="text-center" style={{ fontSize: '3rem' }}>
                   TRANG QUẢN LÝ
                </h1>
            </div>
            <Footer/>
        </div>
    );
};

export default Dashboard;
