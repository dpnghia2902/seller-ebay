import { useEffect, useState } from "react";
import { getOrders } from "../../api/client";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      product: "Iphone 17 Pro Max 1TB",
      color: "Orange",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Pending",
      lastUpdated: "Jan 4, 2022"
    },
    {
      id: 2,
      product: "Case iphone 17 silicon",
      color: "Blue",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Shipped",
      lastUpdated: "Jan 4, 2022"
    },
    {
      id: 3,
      product: "Laptop Asus Gaming Tuf F16",
      color: "",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Shipped",
      lastUpdated: "Jan 2, 2022"
    },
    {
      id: 4,
      product: "Laptop Lenovo Ideapad Slim 5",
      color: "",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Packaging",
      lastUpdated: "Jan 6, 2022"
    },
    {
      id: 5,
      product: "Iphone 11 Pro Max 256GB",
      color: "Sky Blue",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Pending",
      lastUpdated: "Jan 8, 2022"
    },
    {
      id: 6,
      product: "Ipad mini 5 256GB",
      color: "",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Delivered",
      lastUpdated: "Jan 6, 2022"
    },
    {
      id: 7,
      product: "Laptop Asus Zenbook UX425ea",
      color: "",
      image: "/api/placeholder/60/60",
      price: 1199,
      status: "Packaging",
      lastUpdated: "Jan 4, 2022"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await getOrders();
        if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
        // Keep mock data if API fails
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Status" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Shipped":
        return "status-shipped";
      case "Delivered":
        return "status-delivered";
      case "Packaging":
        return "status-packaging";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
      case "Delivered":
        return "#10b981";
      case "Packaging":
        return "#f59e0b";
      case "Pending":
        return "#94a3b8";
      default:
        return "#64748b";
    }
  };

  return (
    <>
      {/* Orders Section */}
      <div className="orders-section">
        <h2 className="section-title">ORDERS</h2>
        
        {/* Search and Filter Bar */}
        <div className="orders-toolbar">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-dropdown">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option>Status</option>
              <option>Pending</option>
              <option>Packaging</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Status</th>
                <th>Last updated <span className="sort-icon">⌄</span></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="loading-cell">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="loading-cell">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-image">
                          <img src={order.image} alt={order.product} />
                        </div>
                        <div className="product-info">
                          <div className="product-name">{order.product}</div>
                          {order.color && <div className="product-color">({order.color})</div>}
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">${order.price}</td>
                    <td className="status-cell">
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        <span 
                          className="status-dot" 
                          style={{ background: getStatusColor(order.status) }}
                        ></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="date-cell">{order.lastUpdated}</td>
                    <td className="actions-cell">
                      <button className="btn-expand">›</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-btn">‹‹</button>
          <button className="pagination-btn">‹</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-btn">30</button>
          <button className="pagination-btn">31</button>
          <button className="pagination-btn">32</button>
          <button className="pagination-btn">›</button>
          <button className="pagination-btn">››</button>
        </div>
      </div>
    </>
  );
}
