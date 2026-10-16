import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyProductOverrides, saveProductOverride } from "../utils/productOverrides";

const API_URL = "https://fakestoreapi.com/products";
const LOCAL_KEY = "e-shop-exp3-local-products";
const DELETED_KEY = "e-shop-exp3-deleted-products";
const blankForm = { name: "", price: "", category: "electronics", image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", description: "" };

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function normalize(item) {
  return { id: item.id, name: item.name || item.title || "", title: item.name || item.title || "", category: item.category || "general", brand: item.brand || "Store", price: Number(item.price || 0), rating: Number(item.rating?.rate || item.rating || 0), image: item.image || "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", description: item.description || "" };
}

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}?limit=20`);
      if (!response.ok) throw new Error(`GET failed (${response.status}). Please try again.`);
      const data = await response.json();
      const deleted = new Set(readLocal(DELETED_KEY, [] ).map(String));
      const localProducts = readLocal(LOCAL_KEY, []);
      const merged = data.map(item => applyProductOverrides(normalize(item)))
        .filter(item => !deleted.has(String(item.id)));
      const existingIds = new Set(merged.map(item => String(item.id)));
      localProducts.forEach(item => { if (!existingIds.has(String(item.id)) && !deleted.has(String(item.id))) merged.unshift(item); });
      setProducts(merged);
      console.log("[Experiment 3][GET] Products retrieved:", data);
      console.log("[Experiment 3] Displayed product list:", merged);
    } catch (e) {
      setError(e.message || "Unable to retrieve products. Check your internet connection.");
      console.error("[Experiment 3][GET ERROR]", e);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  function resetForm() { setForm(blankForm); setEditingId(null); }
  function startEdit(product) {
    setEditingId(product.id);
    setForm({ name: product.name, price: String(product.price), category: product.category, image: product.image, description: product.description || "" });
    setNotice(`Editing product #${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function changeForm(event) { setForm(current => ({ ...current, [event.target.name]: event.target.value })); }

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setNotice("");
    const price = Number(form.price);
    if (!form.name.trim() || !form.category.trim() || !Number.isFinite(price) || price < 0) {
      setError("Enter a product name, category, and a valid price of 0 or more."); return;
    }
    const body = { title: form.name.trim(), price, category: form.category.trim(), description: form.description.trim(), image: form.image.trim() || blankForm.image };
    setSaving(true);
    try {
      if (editingId !== null) {
        const response = await fetch(`${API_URL}/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!response.ok) throw new Error(`PUT failed (${response.status}). Product was not updated.`);
        const apiResult = await response.json();
        const updated = normalize({ ...body, ...apiResult, id: editingId, title: body.title });
        saveProductOverride(editingId, { name: updated.name, title: updated.title, price: updated.price, category: updated.category, description: updated.description, image: updated.image });
        setProducts(current => current.map(item => String(item.id) === String(editingId) ? updated : item));
        console.log("[Experiment 3][PUT] Product updated:", apiResult);
        setNotice(`Product #${editingId} updated successfully. (Fake Store API simulates writes; local display is saved in this browser.)`);
      } else {
        const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!response.ok) throw new Error(`POST failed (${response.status}). Product was not created.`);
        const apiResult = await response.json();
        const localProduct = normalize({ ...body, ...apiResult, id: `local-${Date.now()}`, title: body.title });
        const localProducts = readLocal(LOCAL_KEY, []);
        localStorage.setItem(LOCAL_KEY, JSON.stringify([localProduct, ...localProducts]));
        setProducts(current => [localProduct, ...current]);
        console.log("[Experiment 3][POST] API response:", apiResult);
        console.log("[Experiment 3] Product added to this browser's product list:", localProduct);
        setNotice("Product created successfully and added to this browser's product list. The public demo API does not permanently store new products.");
      }
      resetForm();
    } catch (e) {
      setError(e.message || "The request failed. Please try again.");
      console.error("[Experiment 3][SAVE ERROR]", e);
    } finally { setSaving(false); }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete '${product.name}'?`)) return;
    setDeletingId(product.id); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`DELETE failed (${response.status}). Product was not deleted.`);
      const result = await response.json();
      const deleted = readLocal(DELETED_KEY, []);
      if (!deleted.map(String).includes(String(product.id))) localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted, product.id]));
      localStorage.setItem(LOCAL_KEY, JSON.stringify(readLocal(LOCAL_KEY, []).filter(item => String(item.id) !== String(product.id))));
      setProducts(current => current.filter(item => String(item.id) !== String(product.id)));
      if (String(editingId) === String(product.id)) resetForm();
      console.log("[Experiment 3][DELETE] API response:", result);
      console.log("[Experiment 3] Product removed from this browser's product list:", product);
      setNotice(`Product '${product.name}' deleted from this browser's list. The public demo API simulates deletes.`);
    } catch (e) {
      setError(e.message || "Unable to delete this product.");
      console.error("[Experiment 3][DELETE ERROR]", e);
    } finally { setDeletingId(null); }
  }

  return <div className="page admin-page">
    <section className="hero"><p className="api-tag">EXPERIMENT 3 · REST API CRUD</p><h1>Product Management</h1><p>Retrieve, create, update, and delete products using GET, POST, PUT, and DELETE requests.</p></section>
    <section className="panel admin-info"><strong>Console output:</strong> Open browser DevTools with <kbd>F12</kbd> → <strong>Console</strong> to see API responses and CRUD actions.</section>
    {notice && <p className="success-message admin-notice" role="status">{notice}</p>}
    {error && <section className="panel api-error" role="alert"><p>{error}</p><button onClick={() => setError("")}>Dismiss</button> <button onClick={loadProducts}>Reload Products</button></section>}
    <section className="panel crud-form-panel">
      <h2>{editingId !== null ? `Update Product #${editingId}` : "Add a New Product"}</h2>
      <form className="crud-form" onSubmit={handleSubmit}>
        <label>Product name<input name="name" value={form.name} onChange={changeForm} placeholder="Enter product name" required /></label>
        <label>Price (₹)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={changeForm} placeholder="Enter price" required /></label>
        <label>Category<input name="category" value={form.category} onChange={changeForm} placeholder="e.g. electronics" required /></label>
        <label>Image URL<input name="image" value={form.image} onChange={changeForm} placeholder="https://..." /></label>
        <label className="crud-description">Description<textarea name="description" value={form.description} onChange={changeForm} rows="2" placeholder="Product description" /></label>
        <div className="crud-actions"><button type="submit" disabled={saving}>{saving ? "Saving…" : editingId !== null ? "Update Product (PUT)" : "Add Product (POST)"}</button>{editingId !== null && <button type="button" className="secondary-button" onClick={resetForm}>Cancel Edit</button>}</div>
      </form>
    </section>
    <div className="crud-heading"><h2>Products</h2><button className="secondary-button" onClick={loadProducts} disabled={loading}>{loading ? "Loading…" : "Refresh (GET)"}</button></div>
    {loading && <section className="panel loading"><div className="spinner"/><h3>Loading products from API…</h3></section>}
    {!loading && !error && products.length === 0 && <section className="panel"><p>No products found.</p></section>}
    {!loading && products.length > 0 && <div className="admin-product-list">{products.map(product => <article className="panel admin-product" key={product.id}>
      <img src={product.image} alt={product.name} onError={e => { e.currentTarget.style.visibility = "hidden"; }} />
      <div className="admin-product-fields crud-product-fields"><strong>{product.name}</strong><span>Category: {product.category}</span><b>₹{Number(product.price).toFixed(2)}</b><small>Product ID: {product.id}</small><div className="crud-actions"><button type="button" onClick={() => startEdit(product)}>Edit / PUT</button><button type="button" className="danger-button" onClick={() => deleteProduct(product)} disabled={deletingId === product.id}>{deletingId === product.id ? "Deleting…" : "Delete"}</button></div></div>
    </article>)}</div>}
    <p className="admin-back"><Link to="/products">← Back to shop</Link></p>
  </div>;
}
export default Admin;
