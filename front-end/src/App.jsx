import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./components/Dashboard/Dashboard";
import ModernDashboard from "./components/Dashboard/ModernDashboard";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
  return <ModernDashboard />;
}

export default App;
