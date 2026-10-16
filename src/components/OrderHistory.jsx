import React from "react";
import { useOrders } from "../context/OrderContext";

function OrderHistory() {
  const { orders } = useOrders();
  return <section className="panel"><h2>Order History</h2>{orders.length ? orders.map((order) => <p key={order.id}>Order #{order.id} — {order.date} — ₹{order.total}</p>) : <p>No previous orders.</p>}</section>;
}
export default OrderHistory;