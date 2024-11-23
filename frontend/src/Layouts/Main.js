import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Layouts/Home"; // Adjust the path if needed
import Collections from "../pages/home/Collections"; // Ensure the path is correct
import ProductPage from "../pages/products/ProductPage";
import ShoppingCart from "../pages/home/ShoppingCart";
import Wishlist from "../pages/home/Wishlist";
import Checkout from "../pages/home/Checkout";
import ProductDetail from "../pages/products/ProductDetail";
import News from "../pages/tinTuc/News";
import ContactForm from "../pages/lienHe/ContactForm";
import FeedbackPage from "../pages/phanHoi/FeedbackPage";
import ProfilePage from "../pages/thongTin/ProfilePage";


import UserProfile from "../pages/user/UserProfile";

const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product" element={<ProductPage/>} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route exact path="/tin-tuc" element={<News />} />
      <Route exact path="/lien-he" element={<ContactForm />} />
      <Route exact path="/phan-hoi" element={<FeedbackPage />} />
      <Route path="/thong-tin" element={<ProfilePage />} />
      <Route exact path="/my-account" element={<UserProfile/>} />
    </Routes>
  </main>
);

export default Main;
