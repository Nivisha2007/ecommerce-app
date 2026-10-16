import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/products" className="footer-logo">E-Shop<span>.</span></Link>
          <p>Your everyday shopping, made simple. Explore products, compare details, and shop with confidence.</p>
          <div className="footer-trust"><span>✓ Secure account</span><span>✓ Easy shopping</span><span>✓ Product details</span></div>
        </div>
        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/products">All products</Link>
          <Link to="/cart">Shopping cart</Link>
          <Link to="/orders">My orders</Link>
        </div>
        <div className="footer-column">
          <h3>Your account</h3>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Create an account</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div className="footer-column footer-note">
          <h3>Need help?</h3>
          <p>Browse product details before adding items to your cart.</p>
          <p className="footer-api-note"><span className="footer-dot" /> Live product data via REST API</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 E-Shop. All rights reserved.</span>
        <span>Built for the E-Commerce REST API experiment</span>
      </div>
    </footer>
  );
}

export default Footer;
