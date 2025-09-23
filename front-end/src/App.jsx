import { useState } from "react";
import Login from "./pages/login";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
