import { useState } from "react";
import "./Layout.css";

export default function Layout({ children, currentPage, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", icon: "", label: "Dashboard" },
    { id: "orders", icon: "", label: "Orders" },
    { id: "products", icon: "", label: "Products" },
    { id: "inventory", icon: "", label: "Inventory" },
    { id: "profile", icon: "", label: "Profile" }
  ];

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "" : "collapsed"}`}>
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="brand">FSShop</div>
          <button 
            className="hamburger" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button 
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <header className="main-header">
            <h1 className="page-title">Seller management</h1>
            <div className="user-info">
              <div className="user-avatar"></div>
              <span className="user-role">ADMIN</span>
              <span className="dropdown-arrow"></span>
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  );
}
