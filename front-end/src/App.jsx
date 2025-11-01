import { useState } from "react";
import Login from "./pages/login";
import ModernDashboard from "./components/Dashboard/ModernDashboard";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Login />
    </div>
  );
  return <ModernDashboard />;
}

export default App;
