import React, { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ecommerce-orders")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("ecommerce-orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (order) => {
    const newOrder = { ...order, id: Date.now(), date: new Date().toLocaleString(), status: "Placed" };
    setOrders((current) => [newOrder, ...current]);
    return newOrder;
  };

  return <OrderContext.Provider value={{ orders, placeOrder }}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  return useContext(OrderContext);
}