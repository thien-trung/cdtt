import React from 'react';
import Footer from '../../Layouts/Footer';

const UserProfile = () => {
    return (
        <div>
            <div 
                className="d-flex flex-column justify-content-center align-items-center" 
                style={{ height: 'calc(100vh - 400px)', padding: '20px' }}
            >
                <h1 style={{ textAlign: 'center', color: '#333' }}>Track My Order</h1>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;
