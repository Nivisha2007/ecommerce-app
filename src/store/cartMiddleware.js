const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith("cart/")) {
    console.log("[Cart Middleware]", action.type, {
      cartItems: store.getState().cart.length,
      actionPayload: action.payload,
    });
  }
  return result;
};

export default cartMiddleware;
