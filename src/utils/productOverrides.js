const STORAGE_KEY = "e-shop-product-overrides";
export function getProductOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
export function applyProductOverrides(product) {
  const override = getProductOverrides()[String(product.id)];
  return override ? { ...product, ...override } : product;
}
export function saveProductOverride(id, changes) {
  const all = getProductOverrides();
  all[String(id)] = { ...(all[String(id)] || {}), ...changes };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("e-shop-products-updated"));
  return all[String(id)];
}
