import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { cart } = useCartContext();
  const { user, isAuthenticated, logout } = useAuth();
  return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="header"><div className="header-container">
    <Link className="logo" to="/products">E-Shop</Link>
    <nav className="navigation">
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/admin">Admin</NavLink>
      <NavLink to="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      {!isAuthenticated ? <NavLink to="/login">Login</NavLink> : <><span className="welcome-user">Hi, {user.username}</span><button className="logout-button" type="button" onClick={logout} aria-label="Log out of your account">Logout</button></>}
    </nav>
  </div></header></>;
}
export default Header;