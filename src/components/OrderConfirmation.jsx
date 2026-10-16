import React from "react";
import { Link } from "react-router-dom";

function OrderConfirmation() {
  return <section className="page panel confirmation"><h1>Order placed successfully!</h1><p>Thank you for shopping with us.</p><Link className="button-link" to="/products">Continue Shopping</Link><p><Link to="/orders/current">View your orders</Link></p></section>;
}
export default OrderConfirmation;