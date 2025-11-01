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

// Orders API
export async function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/orders${query ? '?' + query : ''}`);
}

export async function getOrderById(orderId) {
  return apiGet(`/orders/${orderId}`);
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`PUT /orders/${orderId}/status failed`);
  return res.json();
}


//Inventory API

export async function getInventory(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/inventory${query ? '?' + query : ''}`);
}

export async function getInventoryById(productId) {
  return apiGet(`/inventory/${productId}`);
}


export async function createInventoryProduct(productData) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('POST /inventory failed');
  return res.json();
}


export async function updateInventoryProduct(productId, productData) {
  const res = await fetch(`${API_BASE}/inventory/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error(`PUT /inventory/${productId} failed`);
  return res.json();
}


export async function updateInventoryStatus(productId, status) {
  const res = await fetch(`${API_BASE}/inventory/${productId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`PATCH /inventory/${productId}/status failed`);
  return res.json();
}


export async function deleteInventoryProduct(productId) {
  const res = await fetch(`${API_BASE}/inventory/${productId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`DELETE /inventory/${productId} failed`);
  return res.json();
}
