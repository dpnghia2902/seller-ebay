const API_BASE = import.meta.env?.VITE_API_BASE || "/api"; // configurable via .env, defaults to Vite proxy

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function getTopProducts() {
  return apiGet("/dashboard/top-products");
}

export async function getSummary() {
  return apiGet("/dashboard/summary");
}

export async function getMonthlySales() {
  return apiGet("/dashboard/sales-monthly");
}


