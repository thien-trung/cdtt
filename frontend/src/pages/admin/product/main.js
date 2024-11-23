import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ListProduct from "./ListProduct";
import CreateProduct from "./CreateProduct";


const Main = () => (
  <main>
    <Routes>
    <Route path="products/edit/:id" element={<EditProduct />} />
    <Route path="/product" element={<ListProduct />} />
    </Routes>
  </main>
);

export default Main;
