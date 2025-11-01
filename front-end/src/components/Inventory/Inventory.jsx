import { useEffect, useState } from "react";
import { getInventory, updateInventoryStatus } from "../../api/client";
import "./Inventory.css";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
            name: "Iphone 17 Pro Max 1TB (Orange)",
            price: 1199,
            status: "Available",
            description: "The iPhone 17 Pro Max combines the ultra-fast A10 Bionic chip with an ...",
          },
          {
            id: 2,
            image: "📱",
            name: "Case iphone 17 silicon (Blue)",
            price: 1199,
            status: "Available",
            description: "This silicone case provides reliable protection for your iPhone 17 against ...",
          },
          {
            id: 3,
            image: "💻",
            name: "Laptop Asus Gaming Tuf F16",
            price: 1199,
            status: "Available",
            description: "Engineered for gamers, the Asus TUF F16 delivers powerful performance ...",
          },
          {
            id: 4,
            image: "💻",
            name: "Laptop Lenovo Ideapad Slim 5",
            price: 1199,
            status: "Hidden",
            description: "The Lenovo IdeaPad Slim 5 is a sleek and lightweight laptop designed ...",
          },
          {
            id: 5,
            image: "📱",
            name: "Iphone 13 Pro Max 256GB (Sky Blue)",
            price: 1199,
            status: "Available",
            description: "The iPhone 13 Pro Max features a stunning Super Retina XDR display ...",
          },
          {
            id: 6,
            image: "📱",
            name: "Ipad mini 5 256GB",
            price: 1199,
            status: "Available",
            description: "Compact yet powerful, the iPad mini 5 is perfect for reading, streaming, ...",
          },
          {
            id: 7,
            image: "💻",
            name: "Laptop Asus Zenbook UX425ea",
            price: 1199,
            status: "Hidden",
            description: "The Asus ZenBook UX425Ea is an ultra-slim and elegant laptop ...",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return status.toLowerCase() === "available" ? "status-available" : "status-hidden";
  };

  // Function for future use - will be connected to Edit button
  const _handleStatusChange = async (productId, newStatus) => {
    try {
      await updateInventoryStatus(productId, newStatus);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error("Error updating status:", error);
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
            <option value="all">Status</option>
            <option value="available">Available</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Description</th>
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
                <td colSpan={5} className="empty-cell">No products found</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-image">{product.image}</div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="price-cell">${product.price}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${getStatusClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="product-description">{product.description}</td>
                  <td>
                    <div className="product-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
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
    </div>
  );
}
