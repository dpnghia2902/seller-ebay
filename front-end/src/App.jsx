import { useState } from "react";
import Layout from "./components/Layout/Layout";
import DashboardContent from "./components/Dashboard/DashboardContent";
import Orders from "./components/Orders/Orders";
import Inventory from "./components/Inventory/Inventory";
import Login from "./pages/login";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // true = bỏ qua login, false = hiện login

  // Nếu chưa đăng nhập, hiển thị trang Login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Tất cả trang đều dùng Layout chung
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />;
      case "orders":
        return <Orders />;
      case "products":
        return (
          <div className="products-section">
            <h2 className="section-title">Products</h2>
            <p>Products page coming soon...</p>
          </div>
        );
      case "inventory":
        return <Inventory />;
      case "profile":
        return (
          <div className="products-section">
            <h2 className="section-title">Profile</h2>
            <p>Profile page coming soon...</p>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
