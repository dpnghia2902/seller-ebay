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

// Products API
/**
 * Get all products with optional filters
 * @param {Object} params - Query parameters (search, status, page, limit)
 * @returns {Promise<Object>} { products: Array, total: number, page: number, totalPages: number }
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/products${query ? '?' + query : ''}`);
}

/**
 * Get a single product by ID
 * @param {string|number} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
export async function getProductById(productId) {
  return apiGet(`/products/${productId}`);
}

/**
 * Create a new product
 * @param {Object} productData - Product data (title, price, status, description, image_url, etc.)
 * @returns {Promise<Object>} Created product object
 */
export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('POST /products failed');
  return res.json();
}

/**
 * Update an existing product
 * @param {string|number} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product object
 */
export async function updateProduct(productId, productData) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error(`PUT /products/${productId} failed`);
  return res.json();
}

/**
 * Update product status (Available/Hidden)
 * @param {string|number} productId - Product ID
 * @param {string} status - New status ("Available" or "Hidden")
 * @returns {Promise<Object>} Updated product object
 */
export async function updateProductStatus(productId, status) {
  const res = await fetch(`${API_BASE}/products/${productId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`PATCH /products/${productId}/status failed`);
  return res.json();
}

/**
 * Delete a product
 * @param {string|number} productId - Product ID
 * @returns {Promise<Object>} Success response
 */
export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`DELETE /products/${productId} failed`);
  return res.json();
}

/**
 * Upload product image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} { url: string, imageId: string }
 */
export async function uploadProductImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const res = await fetch(`${API_BASE}/products/upload-image`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('POST /products/upload-image failed');
  return res.json();
}

/**
 * Save product as draft
 * @param {Object} productData - Product data to save as draft
 * @returns {Promise<Object>} Saved draft object
 */
export async function saveProductDraft(productData) {
  const res = await fetch(`${API_BASE}/products/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...productData, draft: true })
  });
  if (!res.ok) throw new Error('POST /products/draft failed');
  return res.json();
}