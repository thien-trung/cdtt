import React from "react";
import { Routes, Route } from "react-router-dom";
import TrackMyOrder from "../pages/oder/TrackMyOrder";
import Home from "../pages/oder/TrackMyOrder";

import AllOrders from "../pages/oder/AllOrders";
import UnpaidOrders from "../pages/oder/UnpaidOrders";
import PendingShipment from "../pages/oder/PendingShipment";
import ShippedOrders from "../pages/oder/ShippedOrders";
import Returns from "../pages/oder/Returns";

const Mainn = () => (
  <mainn>
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/track-oder" element={<TrackMyOrder />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/unpaid-orders" element={<UnpaidOrders />} />
        <Route path="/pending-shipment" element={<PendingShipment />} />
        <Route path="/shipped-orders" element={<ShippedOrders />} />
        <Route path="/returns" element={<Returns />} />
    </Routes>
  </mainn>
);

export default Mainn;
