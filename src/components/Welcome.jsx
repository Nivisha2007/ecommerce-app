import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return <section className="welcome-page"><div className="welcome-card"><p className="eyebrow">WELCOME TO</p><h1>E-Commerce</h1><p>Explore products, manage your cart, and place orders.</p><div className="welcome-actions"><Link to="/products" className="button-link">Shop Now</Link><Link to="/login" className="button-link secondary-button">Log In</Link></div></div></section>;
}
export default Welcome;