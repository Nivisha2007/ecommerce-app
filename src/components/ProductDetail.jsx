import React from "react";
import { Link, useParams } from "react-router-dom";
import { useProductById } from "../hooks/useProducts";
import { useCartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProductById(id);
  const { addToCart } = useCartContext();
  if (loading) return <div className="page"><section className="panel loading"><div className="spinner"/><h2>Loading product details…</h2></section></div>;
  if (error || !product) return <div className="page"><section className="panel api-error"><h2>Product details unavailable</h2><p>{error || "Product not found."}</p><Link to="/products">Back to products</Link></section></div>;
  return (
    <div className="page">
      <section className="product-detail panel">
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/product-placeholder.svg"; }} />
        <div><p className="api-tag">PRODUCT #{product.id}</p><h1>{product.name}</h1><p>{product.description}</p><p><strong>Category:</strong> {product.category}</p><p><strong>Rating:</strong> ⭐ {Number(product.rating).toFixed(1)} ({product.count} reviews)</p><h2>₹{Number(product.price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h2><button onClick={() => addToCart(product)}>Add to Cart</button><p><Link to="/products">← Back to products</Link></p></div>
      </section>
    </div>
  );
}
export default ProductDetail;
