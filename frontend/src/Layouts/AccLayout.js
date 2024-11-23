 // src/Layouts/UserLayout.js
import React from 'react';
import Header from '../pages/oder/Header';
import Footer from './Footer';
import Mainn from './Mainn';
import Navv from './Navv';


const AccLayout = () => {
    return (
        <div>
            <Header />
            <Navv />
            <Mainn />
            <Footer />
        </div>
    );
};
export default AccLayout ;
