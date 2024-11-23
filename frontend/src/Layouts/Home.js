import React from "react";
import Collections from "../pages/home/Collections";
import Carousel from "../pages/home/Carousel";
import HotDeals from "./../pages/home/HotDeals";
import Widgets from "./../pages/home/Widgets";
import ToastMessage from "./../pages/home/ToastMessage";
function Home(props) {
  return (
    <div>
      <Collections />
      <ToastMessage />
      <Carousel title="Sản phẩm mới " id="1" />
      <HotDeals />
      <Carousel title="Sản phẩm bán chạy nhất" id="2" />
      <Widgets />
    </div>
  );
}
export default Home;
