import React from 'react';
import Admin from '../pages/admin/Dashboard';
import ListProduct from '../pages/admin/product/ListProduct';
import { Route, Routes } from 'react-router-dom';
import Header from '../pages/admin/product/Header';
import ListCategory from '../pages/admin/product/ListCategory';
import CreateProduct from '../pages/admin/product/CreateProduct';
import EditProduct from '../pages/admin/product/EditProduct';
import ListOrder from '../pages/admin/oder/ListOrder';
import AddOrder from '../pages/admin/oder/Addoder';
import EditOrder from '../pages/admin/oder/EditOrder';



const AdminLayout= () =>(
        <main>
            <Header/>
            <Routes>
                <Route index element={<Admin />} />
                <Route path="/product" element={<ListProduct />} />
                <Route path="/category" element={<ListCategory />} />
                <Route path="/order" element={<ListOrder/>} />
                <Route path="/product/create" element={<CreateProduct />} />
                <Route path="/products/edit/:id" element={<EditProduct />} />
                <Route path="/order/create" element={<AddOrder/>} />
                <Route path="/order/edit/:id" element={<EditOrder />} />
            </Routes>
        </main>
    );
export default AdminLayout;
