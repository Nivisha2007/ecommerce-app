import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart as addAction,
  removeFromCart as removeAction,
  updateQuantity as updateAction,
  clearCart as clearAction,
} from "../store/cartSlice";

const CartContext = createContext(null);

// Keeps the existing component API while the actual shared state is managed by Redux Toolkit.
export function CartProvider({ children }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCart = (product) => dispatch(addAction(product));
  const removeFromCart = (id) => dispatch(removeAction(id));
  const updateQuantity = (id, quantity) =>
    dispatch(updateAction({ id, quantity }));
  const clearCart = () => dispatch(clearAction());

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const discount = subtotal >= 2000 ? subtotal * 0.1 : 0;
  const delivery = subtotal === 0 || subtotal >= 1000 ? 0 : 50;
  const total = Math.max(0, subtotal - discount + delivery);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart,
        subtotal, discount, delivery, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
