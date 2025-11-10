import { useEffect, useState } from "react";
import { getProducts, updateProductStatus, deleteProduct, createProduct } from "../../api/client";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Iphone 17 Pro Max 1TB (Orange)",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Available",
      description: "The iPhone 17 Pro Max combines the ultra-fast A19 Bionic chip with an advanced triple-camera system and a stunning Super Retina XDR display. With 1TB of storage, you'll have plenty of space for all your photos, videos, and apps."
    },
    {
      id: 2,
      title: "Case iphone 17 silicon (Blue)",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Hidden",
      description: "This silicone case provides reliable protection for your iPhone 17 against drops and scratches while maintaining a slim, comfortable profile. The soft-touch finish feels great in your hand."
    },
    {
      id: 3,
      title: "Laptop Asus Gaming Tuf F16",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Available",
      description: "Engineered for gamers, the Asus TUF F16 delivers powerful performance with the latest Intel Core processor and NVIDIA GeForce RTX graphics. Built to last with military-grade durability."
    },
    {
      id: 4,
      title: "Laptop Lenovo Ideapad Slim 5",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Hidden",
      description: "The Lenovo IdeaPad Slim 5 is a sleek and lightweight laptop designed for productivity. Featuring a vibrant display and long-lasting battery, it's perfect for work and entertainment on the go."
    },
    {
      id: 5,
      title: "Iphone 13 Pro Max 256GB (Sky Blue)",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Available",
      description: "The iPhone 13 Pro Max features a stunning Super Retina XDR display, A15 Bionic chip, and an advanced camera system. With 256GB of storage, capture your memories in stunning detail."
    },
    {
      id: 6,
      title: "Ipad mini 5 256GB",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Available",
      description: "Compact yet powerful, the iPad mini 5 is perfect for reading, streaming, and creating. With 256GB of storage and Apple Pencil support, it's ideal for students and professionals."
    },
    {
      id: 7,
      title: "Laptop Asus Zenbook UX425ea",
      image_url: "/api/placeholder/60/60",
      price: 1199,
      status: "Hidden",
      description: "The Asus ZenBook UX425EA is an ultra-slim and elegant laptop that doesn't compromise on performance. Perfect for professionals who need style and power in one package."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(32);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "New",
    hideFromList: false,
    images: []
  });

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 10,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== "Status" && { status: statusFilter })
        };
        const data = await getProducts(params);
        if (data && Array.isArray(data.products)) {
          // Map backend _id to frontend id and handle image URLs
          const mappedProducts = data.products.map(p => ({
            ...p,
            id: p._id || p.id,
            image_url: p.images?.[0] || "/api/placeholder/60/60",
            // Ensure status is properly formatted
            status: p.is_hidden ? "Hidden" : "Available"
          }));
          setProducts(mappedProducts);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        // Show error message to user
        alert("Failed to load products. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    
    // Load products from API
    loadProducts();
  }, [currentPage, searchTerm, statusFilter]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown-container') && !event.target.closest('.action-dropdown-container')) {
        setShowStatusDropdown(null);
        setShowActionDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Status" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await updateProductStatus(productId, newStatus);
      // Update local state
      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: newStatus, is_hidden: newStatus === "Hidden" } : p
      ));
      setShowStatusDropdown(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update product status. Please try again.");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleEdit = (productId) => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit product:", productId);
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(2);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(2);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages - 1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="products-section">
      <h2 className="section-title">Products</h2>
      
      {/* Search and Filter Bar */}
      <div className="products-toolbar">
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
            <option>Available</option>
            <option>Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="products-table">
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
                <td colSpan={5} className="loading-cell">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="loading-cell">No products found</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr 
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => {
                    setHoveredProduct(null);
                    setShowStatusDropdown(null);
                  }}
                >
                  <td>
                    <div className="product-cell">
                      <div className="product-image">
                        <img src={product.image_url} alt={product.title} />
                      </div>
                      <div className="product-title">{product.title}</div>
                    </div>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td className="status-cell">
                    <div className="status-dropdown-container">
                      <button 
                        className={`status-button status-${product.status.toLowerCase()}`}
                        onClick={() => setShowStatusDropdown(
                          showStatusDropdown === product.id ? null : product.id
                        )}
                      >
                        {product.status}
                        <span className="dropdown-arrow">⌄</span>
                      </button>
                      {showStatusDropdown === product.id && (
                        <div className="status-dropdown-menu">
                          <button
                            className={`status-option ${product.status === "Available" ? "active" : ""}`}
                            onClick={() => handleStatusChange(product.id, "Available")}
                          >
                            Available
                          </button>
                          <button
                            className={`status-option ${product.status === "Hidden" ? "active" : ""}`}
                            onClick={() => handleStatusChange(product.id, "Hidden")}
                          >
                            Hidden
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="description-cell">
                    {truncateDescription(product.description)}
                  </td>
                  <td className="actions-cell">
                    <div className="action-dropdown-container">
                      <button 
                        className="btn-expand"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionDropdown(
                            showActionDropdown === product.id ? null : product.id
                          );
                        }}
                      >
                        ›
                      </button>
                      {showActionDropdown === product.id && (
                        <div className="action-dropdown-menu">
                          <button
                            className="action-option action-edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product.id);
                              setShowActionDropdown(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="action-option action-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product.id);
                              setShowActionDropdown(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
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
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          ‹‹
        </button>
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {renderPagination().map((page, index) => (
          page === "..." ? (
            <span key={`dots-${index}`} className="pagination-dots">...</span>
          ) : (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          )
        ))}
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          ››
        </button>
      </div>

      {/* Floating Add Button */}
      <button 
        className="fab-add" 
        aria-label="Add product"
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add product</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body add-product-form">
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-left">
                  {/* Product Title */}
                  <div className="form-group">
                    <label className="form-label">
                      Product Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter product title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      maxLength={80}
                    />
                    <div className="character-counter">
                      {formData.title.length}/80 characters
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe your product in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      maxLength={1000}
                      rows={6}
                    />
                    <div className="character-counter">
                      {formData.description.length}/1000 characters
                    </div>
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Sports">Sports</option>
                      <option value="Books">Books</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-right">
                  {/* Product Images */}
                  <div className="form-group">
                    <label className="form-label">Product Images</label>
                    <div className="image-upload-grid">
                      <div className="image-upload-box">
                        <div className="camera-icon">📷</div>
                        <div className="upload-text">Add Photo</div>
                      </div>
                      <div className="image-upload-box">
                        <div className="plus-icon">+</div>
                      </div>
                      <div className="image-upload-box">
                        <div className="plus-icon">+</div>
                      </div>
                    </div>
                    <div className="upload-hint">
                      Add up to 10 photos. First photo will be the cover image.
                    </div>
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label className="form-label">
                      Price <span className="required">*</span>
                    </label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        className="form-input price-input"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="form-group">
                    <label className="form-label">
                      Condition <span className="required">*</span>
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="condition"
                          value="New"
                          checked={formData.condition === "New"}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        />
                        <span>New</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="condition"
                          value="Used - Like New"
                          checked={formData.condition === "Used - Like New"}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        />
                        <span>Used - Like New</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="condition"
                          value="Used - Good"
                          checked={formData.condition === "Used - Good"}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        />
                        <span>Used - Good</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="condition"
                          value="Used - Fair"
                          checked={formData.condition === "Used - Fair"}
                          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        />
                        <span>Used - Fair</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hide from list */}
              <div className="form-group toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={formData.hideFromList}
                    onChange={(e) => setFormData({ ...formData, hideFromList: e.target.checked })}
                  />
                  <span className="toggle-text">
                    <strong>Hide from list</strong>
                    <span className="toggle-hint">Only seller can see this product</span>
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="modal-footer">
                <button
                  className="btn-save-draft"
                  onClick={() => {
                    console.log("Save Draft:", formData);
                    // TODO: Implement save draft functionality
                  }}
                >
                  Save Draft
                </button>
                <button
                  className="btn-publish"
                  onClick={async () => {
                    try {
                      const newProduct = await createProduct({
                        title: formData.title,
                        description: formData.description,
                        category: formData.category,
                        price: parseFloat(formData.price),
                        sku: formData.sku || `SKU-${Date.now()}`,
                        condition: formData.condition,
                        status: formData.hideFromList ? "Hidden" : "Available",
                        image_url: "/api/placeholder/60/60"
                      });
                      
                      // Close modal and reset form
                      setShowAddModal(false);
                      setFormData({
                        title: "",
                        description: "",
                        category: "",
                        price: "",
                        condition: "New",
                        hideFromList: false,
                        images: []
                      });
                      
                      // Add new product to list instead of reload
                      if (newProduct) {
                        const mappedProduct = {
                          ...newProduct,
                          id: newProduct._id || newProduct.id,
                          image_url: newProduct.images?.[0] || "/api/placeholder/60/60",
                          status: newProduct.is_hidden ? "Hidden" : "Available"
                        };
                        setProducts([mappedProduct, ...products]);
                      }
                      
                      alert("Product published successfully!");
                    } catch (error) {
                      console.error("Failed to create product:", error);
                      alert("Failed to publish product. Please try again.");
                    }
                  }}
                  disabled={!formData.title || !formData.description || !formData.category || !formData.price}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

