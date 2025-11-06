import { useState } from "react";
import Layout from "./components/Layout/Layout";
import DashboardContent from "./components/Dashboard/DashboardContent";
import Orders from "./components/Orders/Orders";
import Inventory from "./components/Inventory/Inventory";
import Products from "./components/Products/Products";
import Login from "./pages/login";
import ModernDashboard from "./components/Dashboard/ModernDashboard";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
