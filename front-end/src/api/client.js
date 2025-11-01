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

/**
 * Adjust inventory stock quantity (add or remove stock)
 * @param {string|number} productId - Product ID
 * @param {Object} adjustment - Stock adjustment details
 * @param {number} adjustment.stockAdjustment - Quantity to adjust (positive for add, negative for remove)
 * @param {string} adjustment.reason - Reason for adjustment ("Stock In", "Stock Out", "Damaged", "Return", etc.)
 * @param {string} [adjustment.notes] - Optional notes
 * @returns {Promise<Object>} Updated product with new stock level
 */
export async function adjustInventoryStock(productId, adjustment) {
  const res = await fetch(`${API_BASE}/inventory/${productId}/adjust-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adjustment)
  });
  if (!res.ok) throw new Error(`POST /inventory/${productId}/adjust-stock failed`);
  return res.json();
}

/**
 * Get inventory stock history/logs
 * @param {string|number} productId - Product ID
 * @param {Object} params - Query parameters (page, limit, startDate, endDate)
 * @returns {Promise<Object>} { logs: Array, total: number }
 */
export async function getInventoryStockHistory(productId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/inventory/${productId}/stock-history${query ? '?' + query : ''}`);
}

/**
 * Get low stock alert products
 * @param {number} threshold - Stock threshold (default: 10)
 * @returns {Promise<Array>} Array of products with low stock
 */
export async function getLowStockProducts(threshold = 10) {
  return apiGet(`/inventory/low-stock?threshold=${threshold}`);
}
