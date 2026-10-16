import React from "react";
import ProductCard from "./ProductCard";

function Home({ search, setSearch, category, setCategory, categories, filteredProducts, visibleProducts, loading, error, page, setPage, totalPages, retry }) {
  return (
    <div className="page">
      <section className="hero"><h1>Find your everyday essentials</h1><p>Browse live product information from a REST API, search, filter and explore product details.</p></section>
      <section className="filters panel api-filters">
        <input aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((name) => <option key={name} value={name}>{name === "All" ? "All Categories" : name}</option>)}
        </select>
      </section>
      <div className="section-heading"><div><h2>Products</h2><p className="muted">{loading ? "Fetching products from API…" : `${filteredProducts.length} products found`}</p></div><span className="api-tag">REST API · Fetch · async/await</span></div>
      {loading && <section className="panel loading" role="status"><div className="spinner"/><h3>Loading products…</h3><p>Please wait while we fetch product data.</p></section>}
      {!loading && error && <section className="panel api-error" role="alert"><h3>Could not load products</h3><p>{error}</p><button onClick={retry}>Try Again</button></section>}
      {!loading && !error && visibleProducts.length > 0 && <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      {!loading && !error && visibleProducts.length === 0 && <section className="panel"><h3>No products found</h3><p>Try a different search or category.</p></section>}
      {!loading && !error && filteredProducts.length > 0 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button></div>}
    </div>
  );
}
export default Home;
