// src/Layouts/UserLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Nav from './Nav';
import Main from './Main';

import QuickView from '../pages/home/QuickView';

const UserLayout = () => {
    return (
        <div>
            <QuickView />
            <Header />
            <Nav />
            <Main />
            <Footer />
        </div>
    );
};

export default UserLayout;
