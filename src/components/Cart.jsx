import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

function money(value) {
  return Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, discount, delivery, total } = useCartContext();
  if (!cart.length) return <section className="page panel"><h1>Your Cart</h1><p>Your cart is empty.</p><Link to="/products">Continue shopping</Link></section>;

  return (
    <section className="page panel">
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div className="cart-row" key={item.id}>
          <img src={item.image} alt={item.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
          <div className="cart-item-info"><h3>{item.name}</h3><p>₹{money(item.price)}</p></div>
          <div className="quantity-controls">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button className="danger-button" onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <div className="cart-summary">
        <p>Subtotal: ₹{money(subtotal)}</p>
        <p>Discount {discount > 0 ? "(10% off)" : "(10% off on orders of ₹2,000 or more)"}: −₹{money(discount)}</p>
        <p>Delivery: {delivery === 0 ? "FREE" : `₹${money(delivery)}`}</p>
        <h2>Final Amount: ₹{money(total)}</h2>
      </div>
      <Link className="button-link" to="/checkout">Proceed to Checkout</Link>
    </section>
  );
}
export default Cart;
