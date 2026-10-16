import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import useProducts from "./hooks/useProducts";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import "./App.css";

// Route-level code splitting: these components load only when their route is visited.
const Home = lazy(() => import("./components/Home"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./components/Checkout"));
const Login = lazy(() => import("./components/Login"));
const SignUp = lazy(() => import("./components/SignUp"));
const Orders = lazy(() => import("./components/Orders"));
const CurrentOrders = lazy(() => import("./components/CurrentOrders"));
const OrderHistory = lazy(() => import("./components/OrderHistory"));
const OrderConfirmation = lazy(() => import("./components/OrderConfirmation"));
const Admin = lazy(() => import("./components/Admin"));

function RouteLoading() {
  return <section className="page panel loading" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true" />
    <p>Loading page…</p>
  </section>;
}

function ShopApplication() {
  const { search, setSearch, category, setCategory, categories, filteredProducts, visibleProducts, loading, error, page, setPage, totalPages, retry } = useProducts();
  return <>
    <Header />
    <main id="main-content" tabIndex="-1">
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/products" element={<Home search={search} setSearch={setSearch} category={category} setCategory={setCategory} categories={categories} filteredProducts={filteredProducts} visibleProducts={visibleProducts} loading={loading} error={error} page={page} setPage={setPage} totalPages={totalPages} retry={retry} />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}>
            <Route index element={<Navigate to="current" replace />} />
            <Route path="current" element={<CurrentOrders />} />
            <Route path="history" element={<OrderHistory />} />
          </Route>
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </>;
}

function AppContent() {
  const location = useLocation();
  return location.pathname === "/" ? <Welcome /> : <ShopApplication />;
}

function App() {
  return <BrowserRouter><AuthProvider><CartProvider><OrderProvider><ErrorBoundary><AppContent /></ErrorBoundary></OrderProvider></CartProvider></AuthProvider></BrowserRouter>;
}

export default App;
