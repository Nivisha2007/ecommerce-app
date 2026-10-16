import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

function money(value) {
  return Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function Checkout() {
  const { cart, subtotal, discount, delivery, total, clearCart } = useCartContext();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", phone: "", payment: "Cash on Delivery" });
  const [error, setError] = useState("");
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    if (!cart.length) { setError("Your cart is empty."); return; }
    if (!form.name.trim() || !form.address.trim() || !/^[0-9]{10}$/.test(form.phone)) {
      setError("Enter your name, address, and a valid 10-digit phone number.");
      return;
    }
    placeOrder({ items: cart, subtotal, discount, delivery, total, customer: form });
    clearCart();
    navigate("/order-confirmation");
  };

  if (!cart.length) return <section className="page panel"><h1>Checkout</h1><p>Your cart is empty.</p><Link to="/products">Continue shopping</Link></section>;

  return (
    <section className="page panel narrow">
      <h1>Checkout</h1>
      <div className="cart-summary">
        <p>Subtotal: ₹{money(subtotal)}</p>
        <p>Discount: −₹{money(discount)}</p>
        <p>Delivery: {delivery === 0 ? "FREE" : `₹${money(delivery)}`}</p>
        <h2>Final amount: ₹{money(total)}</h2>
      </div>
      <form className="stack-form" onSubmit={submit}>
        <label>Full name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Address<textarea name="address" value={form.address} onChange={change} rows="3" required /></label>
        <label>Phone number<input name="phone" value={form.phone} onChange={change} inputMode="numeric" maxLength="10" required /></label>
        <label>Payment method<select name="payment" value={form.payment} onChange={change}><option>Cash on Delivery</option><option>UPI</option><option>Card</option></select></label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Place Order</button>
      </form>
    </section>
  );
}
export default Checkout;
