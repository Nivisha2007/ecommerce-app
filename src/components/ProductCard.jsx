import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCartContext();
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/product-placeholder.svg"; }} />
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p>{product.category}</p>
        <p>⭐ {Number(product.rating || 0).toFixed(1)} <span className="muted">({product.count || 0} reviews)</span></p>
        <strong>₹{Number(product.price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
        <div className="product-buttons">
          <Link className="secondary-button" to={`/products/${product.id}`}>View Details</Link>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
export default ProductCard;
