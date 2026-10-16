import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import cartMiddleware from "./cartMiddleware";

export const store = configureStore({
  reducer: { cart: cartReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware),
});

store.subscribe(() => {
  try {
    localStorage.setItem("ecommerce-cart", JSON.stringify(store.getState().cart));
  } catch (error) {
    console.warn("Cart could not be saved in browser storage.", error);
  }
});
