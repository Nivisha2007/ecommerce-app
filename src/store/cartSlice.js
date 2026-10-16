import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const saved = localStorage.getItem("ecommerce-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const found = state.find((item) => item.id === product.id);
      if (found) found.quantity += 1;
      else state.push({ ...product, quantity: 1 });
    },
    removeFromCart(state, action) {
      return state.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state.filter((item) => item.id !== id);
      const found = state.find((item) => item.id === id);
      if (found) found.quantity = quantity;
    },
    clearCart() {
      return [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
