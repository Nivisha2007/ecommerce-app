import React from "react";
import { useOrders } from "../context/OrderContext";

function CurrentOrders() {
  const { orders } = useOrders();
  if (!orders.length) return <section className="panel"><p>No orders yet.</p></section>;
  return <div className="order-list">{orders.map((order) => <article className="panel" key={order.id}><h3>Order #{order.id}</h3><p>{order.date}</p><p>Status: {order.status}</p><p>Total: ₹{order.total}</p><p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p></article>)}</div>;
}
export default CurrentOrders;