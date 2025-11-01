import { useEffect, useState } from "react";
import { getInventory, adjustInventoryStock } from "../../api/client";
import "./Inventory.css";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adjustModal, setAdjustModal] = useState({ show: false, product: null, quantity: 0, type: 'add' });

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getInventory();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error loading inventory:", error);
        // Mock data nếu API lỗi
        setProducts([
          {
            id: 1,
            image: "📱",
            name: "Iphone 17 Pro Max 1TB",
            color: "Orange",
            sku: "IP17PM-ORG-1TB",
            stock: 45,
            price: 1199,
            status: "In Stock",
          },
          {
            id: 2,
            image: "📱",
            name: "Case iphone 17 silicon",
            color: "Blue",
            sku: "CS17-BLU",
            stock: 120,
            price: 29,
            status: "In Stock",
          },
          {
            id: 3,
            image: "💻",
            name: "Laptop Asus Gaming Tuf F16",
            color: "",
            sku: "AS-TUF-F16",
            stock: 8,
            price: 1199,
            status: "Low Stock",
          },
          {
            id: 4,
            image: "💻",
            name: "Laptop Lenovo Ideapad Slim 5",
            color: "",
            sku: "LN-IPS5",
            stock: 0,
            price: 899,
            status: "Out of Stock",
          },
          {
            id: 5,
            image: "📱",
            name: "Iphone 13 Pro Max 256GB",
            color: "Sky Blue",
            sku: "IP13PM-SKY-256",
            stock: 32,
            price: 999,
            status: "In Stock",
          },
          {
            id: 6,
            image: "📱",
            name: "Ipad mini 5 256GB",
            color: "",
            sku: "IPD-MINI5-256",
            stock: 15,
            price: 499,
            status: "In Stock",
          },
          {
            id: 7,
            image: "💻",
            name: "Laptop Asus Zenbook UX425ea",
            color: "",
            sku: "AS-ZB-UX425",
            stock: 5,
            price: 1099,
            status: "Low Stock",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "status-instock";
      case "Low Stock":
        return "status-lowstock";
      case "Out of Stock":
        return "status-outofstock";
      default:
        return "";
    }
  };

  const handleAdjustStock = (product) => {
    setAdjustModal({ show: true, product, quantity: 0, type: 'add' });
  };

  const handleConfirmAdjust = async () => {
    try {
      const { product, quantity, type } = adjustModal;
      const adjustment = type === 'add' ? quantity : -quantity;
      
      await adjustInventoryStock(product.id, {
        stockAdjustment: adjustment,
        reason: type === 'add' ? 'Stock In' : 'Stock Out'
      });

      // Update local state
      setProducts(products.map(p => {
        if (p.id === product.id) {
          const newStock = Math.max(0, p.stock + adjustment);
          let newStatus = p.status;
          if (newStock === 0) newStatus = "Out of Stock";
          else if (newStock <= 10) newStatus = "Low Stock";
          else newStatus = "In Stock";
          
          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      }));

      setAdjustModal({ show: false, product: null, quantity: 0, type: 'add' });
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("Failed to adjust stock. Please try again.");
    }
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">Products</h2>

      {/* Search and Filter Bar */}
      <div className="inventory-controls">
        <input
          type="text"
          className="inventory-search"
          placeholder="Search orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="inventory-filter">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="loading-cell">Loading...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">No products found</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-image">{product.image}</div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        {product.color && <div className="product-color">({product.color})</div>}
                      </div>
                    </div>
                  </td>
                  <td className="sku-cell">{product.sku}</td>
                  <td className="stock-cell">
                    <span className={`stock-value ${product.stock <= 10 ? 'stock-low' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="price-cell">${product.price.toLocaleString()}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${getStatusClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button 
                        className="btn-adjust" 
                        title="Adjust stock"
                        onClick={() => handleAdjustStock(product)}
                      >
                        📦
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn">«</button>
        <button className="pagination-btn">‹</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <span className="pagination-dots">...</span>
        <button className="pagination-btn">30</button>
        <button className="pagination-btn">31</button>
        <button className="pagination-btn">32</button>
        <button className="pagination-btn">›</button>
        <button className="pagination-btn">»</button>
      </div>

      {/* Floating Add Button */}
      <button className="fab-add" aria-label="Add product">
        +
      </button>

      {/* Adjust Stock Modal */}
      {adjustModal.show && (
        <div className="modal-overlay" onClick={() => setAdjustModal({ ...adjustModal, show: false })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adjust Stock</h3>
              <button className="modal-close" onClick={() => setAdjustModal({ ...adjustModal, show: false })}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="product-preview">
                <div className="product-image">{adjustModal.product?.image}</div>
                <div>
                  <div className="product-name">{adjustModal.product?.name}</div>
                  <div className="product-color">{adjustModal.product?.color}</div>
                  <div className="current-stock">Current Stock: <strong>{adjustModal.product?.stock}</strong></div>
                </div>
              </div>

              <div className="adjust-type">
                <button 
                  className={`type-btn ${adjustModal.type === 'add' ? 'active' : ''}`}
                  onClick={() => setAdjustModal({ ...adjustModal, type: 'add' })}
                >
                  ➕ Add Stock
                </button>
                <button 
                  className={`type-btn ${adjustModal.type === 'remove' ? 'active' : ''}`}
                  onClick={() => setAdjustModal({ ...adjustModal, type: 'remove' })}
                >
                  ➖ Remove Stock
                </button>
              </div>

              <div className="quantity-input">
                <label>Quantity</label>
                <input 
                  type="number" 
                  min="0"
                  max={adjustModal.type === 'remove' ? adjustModal.product?.stock : 9999}
                  value={adjustModal.quantity}
                  onChange={(e) => setAdjustModal({ ...adjustModal, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="new-stock-preview">
                New Stock: <strong>
                  {adjustModal.type === 'add' 
                    ? (adjustModal.product?.stock || 0) + (adjustModal.quantity || 0)
                    : Math.max(0, (adjustModal.product?.stock || 0) - (adjustModal.quantity || 0))
                  }
                </strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setAdjustModal({ ...adjustModal, show: false })}>
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleConfirmAdjust}
                disabled={!adjustModal.quantity || adjustModal.quantity === 0}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
