import { applyProductOverrides } from "../utils/productOverrides";
import { useEffect, useMemo, useState } from "react";

const API_URL = "https://fakestoreapi.com/products?limit=20";

function normalizeProduct(item) {
  return {
    id: item.id,
    name: item.title,
    title: item.title,
    category: item.category,
    brand: "Store",
    price: Number(item.price),
    rating: Number(item.rating?.rate || 0),
    image: item.image,
    description: item.description || "A quality product for everyday use.",
    count: Number(item.rating?.count || 0),
  };
}

export function useProductById(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      setLoading(true); setError(""); setProduct(null);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load this product. Please try again.");
        const data = await response.json();
        if (!data || !data.id) throw new Error("Product not found.");
        setProduct(applyProductOverrides(normalizeProduct(data)));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Something went wrong while loading the product.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [id]);
  return { product, loading, error };
}

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      setLoading(true); setError("");
      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to fetch products. Please check your internet connection and try again.");
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("The product API returned an unexpected response.");
        setProducts(data.map(item => applyProductOverrides(normalizeProduct(item))));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to load products.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProducts();
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    const refreshAfterAdminEdit = () => setRefresh(value => value + 1);
    window.addEventListener("e-shop-products-updated", refreshAfterAdminEdit);
    return () => window.removeEventListener("e-shop-products-updated", refreshAfterAdminEdit);
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], [products]);
  const filteredProducts = useMemo(() => products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || product.category === category)
  ), [products, search, category]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [search, category]);

  return { products, filteredProducts, visibleProducts, categories, loading, error, search, setSearch, category, setCategory, page, setPage, totalPages, pageSize, retry: () => setRefresh(value => value + 1) };
}

export default useProducts;
