

import "./assets/sass/app.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Layouts/Main";
import QuickView from "./pages/home/QuickView";
import Admin from "./pages/admin/Dashboard"; // Component Admin cần tạo
import UserLayout from "./Layouts/UserLayout "; // Layout cho người dùng
import AdminLayout from "./Layouts/AdminLayout"; // Layout cho admin
import ProductPage from "./pages/products/ProductPage";
import Wishlist from "./pages/home/Wishlist";
import ShoppingCart from "./pages/home/ShoppingCart";
import Checkout from "./pages/home/Checkout";
import ProductDetail from "./pages/products/ProductDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EditProduct from "./pages/admin/product/EditProduct";
import News from "./pages/tinTuc/News";
import ContactForm from "./pages/lienHe/ContactForm";
import FeedbackPage from "./pages/phanHoi/FeedbackPage";
import ProfilePage from "./pages/thongTin/ProfilePage";
import TrackMyOrder from "./pages/oder/TrackMyOrder";
import AllOrders from "./pages/oder/AllOrders";
import UnpaidOrders from "./pages/oder/UnpaidOrders";
import PendingShipment from "./pages/oder/PendingShipment";
import ShippedOrders from "./pages/oder/ShippedOrders";
import Returns from "./pages/oder/Returns";
import UserProfile from "./pages/user/UserProfile";
import AccLayout from "./Layouts/AccLayout";


function App() {
  return (

      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Admin />} />  
          <Route path="products/edit/:id" element={<EditProduct />} />

        </Route>

        
        <Route path="/" element={<UserLayout />}>
          <Route index element={<QuickView />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="products/:productId" element={<ProductDetail />} />
          <Route exact path="/tin-tuc" element={<News />} />
          <Route exact path="/lien-he" element={<ContactForm />} />
          <Route exact path="/phan-hoi" element={<FeedbackPage />} />
          <Route exact path="/thong-tIn" element={<ProfilePage />} />

          <Route exact path="/track-oder" element={<TrackMyOrder/>} />
          <Route exact path="/my-account" element={<UserProfile/>} />


           <Route path="/all-orders" element={<AllOrders />} />
          <Route path="/unpaid-orders" element={<UnpaidOrders />} />
          <Route path="/pending-shipment" element={<PendingShipment />} />
          <Route path="/shipped-orders" element={<ShippedOrders />} />
          <Route path="/returns" element={<Returns />} />
         
        </Route>
        <Route path="/oder/*" element={<AccLayout />}>
           <Route path="all-orders" element={<AllOrders />} />
          <Route path="unpaid-orders" element={<UnpaidOrders />} />
          <Route path="pending-shipment" element={<PendingShipment />} />
          <Route path="shipped-orders" element={<ShippedOrders />} />
          <Route path="returns" element={<Returns />} />

        </Route>



    </Routes>

  );
}

export default App;

require('./index');
