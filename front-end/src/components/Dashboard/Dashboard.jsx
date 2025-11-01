import { useEffect, useState } from "react";
import { getMonthlySales, getSummary, getTopProducts } from "../../api/client";
import "./Dashboard.css";

function StatCard({ title, value, subtitle, icon, infoIcon = false }) {
  return (
    <div className="stat-card">
      {infoIcon && <div className="info-icon">i</div>}
      <div className="stat-content">
        {icon && <div className="stat-icon">{icon}</div>}
        <div className="stat-text">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
          {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const [hover, setHover] = useState(null);
  const width = 700;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxY = 1800;
  const yTicks = [0, 300, 600, 900, 1200, 1500, 1800];

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * innerW + padding.left;
    const y = height - padding.bottom - (d.value / maxY) * innerH;
    return { x, y, d };
  });
  const poly = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart">
        {/* Grid lines */}
        {yTicks.map((t) => {
          const y = height - padding.bottom - (t / maxY) * innerH;
          return (
            <g key={t}>
              <line 
                x1={padding.left} 
                x2={width - padding.right} 
                y1={y} 
                y2={y} 
                stroke="#f0f0f0" 
                strokeWidth="1" 
              />
              <text 
                x={padding.left - 10} 
                y={y + 4} 
                fontSize="12" 
                textAnchor="end" 
                fill="#9ca3af"
              >
                {t}
              </text>
            </g>
          );
        })}
        
        {/* Line */}
        <polyline 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="3" 
          points={poly} 
        />
        
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="#3b82f6"
              onMouseEnter={() => setHover({ x: p.x, y: p.y, label: p.d.month, value: p.d.value })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          </g>
        ))}
        
        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * innerW + padding.left;
          return (
            <text 
              key={d.month} 
              x={x} 
              y={height - 10} 
              fontSize="12" 
              textAnchor="middle" 
              fill="#6b7280"
            >
              {d.month}
            </text>
          );
        })}
        
        {/* Tooltip */}
        {hover && (
          <g>
            <rect 
              x={hover.x + 10} 
              y={hover.y - 25} 
              rx="6" 
              ry="6" 
              width="80" 
              height="30" 
              fill="#1f2937" 
              stroke="none"
            />
            <text 
              x={hover.x + 50} 
              y={hover.y - 10} 
              fontSize="11" 
              fill="#ffffff" 
              textAnchor="middle"
            >
              {hover.label}
            </text>
            <text 
              x={hover.x + 50} 
              y={hover.y + 5} 
              fontSize="11" 
              fill="#ffffff" 
              textAnchor="middle"
            >
              ${hover.value.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function ProductTable({ products, loading }) {
  return (
    <div className="table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Product name</th>
            <th>Price</th>
            <th>Sold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="loading-cell">Loading...</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className="product-cell">
                  <div className="product-image">
                    <img src="/api/placeholder/60/60" alt={product.name} />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-color">({product.color})</div>
                  </div>
                </td>
                <td className="price-cell">${product.price.toLocaleString()}</td>
                <td className="sold-cell">{product.sold}</td>
                <td className="status-cell">
                  <span className="status-indicator">
                    <span className="status-dot"></span>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [summary, setSummary] = useState({ totalSales: null, income: null });
  const [monthlySales, setMonthlySales] = useState([
    { month: "Jan", value: 800 },
    { month: "Feb", value: 950 },
    { month: "Mar", value: 780 },
    { month: "Apr", value: 1500 },
    { month: "May", value: 1200 },
    { month: "Jun", value: 900 },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [tp, sum, sales] = await Promise.all([
          getTopProducts().catch(() => null),
          getSummary().catch(() => null),
          getMonthlySales().catch(() => null),
        ]);
        if (tp && Array.isArray(tp.products)) setProducts(tp.products);
        if (sum) setSummary(sum);
        if (Array.isArray(sales)) setMonthlySales(sales);
      } catch {}
      finally {
        if (!products.length) {
          setProducts([
            { id: 1, name: "Iphone 17 Pro Max 1TB", color: "Orange", price: 1199, sold: 30, status: "In stock" },
            { id: 2, name: "Iphone 17 Pro Max 1TB", color: "Orange", price: 1199, sold: 50, status: "In stock" },
            { id: 3, name: "Iphone 17 Pro Max 1TB", color: "Orange", price: 1199, sold: 20, status: "In stock" },
          ]);
        }
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSales = monthlySales.reduce((acc, b) => acc + b.value, 0);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? '' : 'collapsed'}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
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
          <button className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">🛒</span>
            <span className="nav-label">Orders</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">📦</span>
            <span className="nav-label">Products</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">🏷️</span>
            <span className="nav-label">Inventory</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <header className="main-header">
            <h1 className="page-title">Seller management</h1>
            <div className="user-info">
              <div className="user-avatar"></div>
              <span className="user-role">ADMIN</span>
              <span className="dropdown-arrow">▾</span>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="overall-sales-card">
              <div className="card-header">
                <h3>Overall Sales</h3>
                <div className="info-icon">i</div>
              </div>
              <div className="card-value">${totalSales.toLocaleString()}</div>
              <div className="chart-container">
                <LineChart data={monthlySales} />
              </div>
            </div>
            
            <div className="stats-column">
              <StatCard 
                title="Total Sales" 
                value={`${summary.totalSales ?? 895} sales`} 
                subtitle="in September"
                icon="🎁"
              />
              <StatCard 
                title="Income" 
                value={`$${(summary.income ?? 1270).toLocaleString()}`} 
                subtitle="in September"
                icon="💰"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="products-section">
            <h2 className="section-title">Top selling Products</h2>
            <ProductTable products={products} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
