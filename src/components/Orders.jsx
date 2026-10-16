import React from "react";
import { Link, Outlet } from "react-router-dom";

function Orders() {
  return <section className="page"><h1>My Orders</h1><div className="tabs"><Link to="/orders/current">Current Orders</Link><Link to="/orders/history">Order History</Link></div><Outlet /></section>;
}
export default Orders;