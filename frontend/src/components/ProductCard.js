// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, listing, onBuyClick }) => {
  // Support both product and listing props
  const item = product || listing;

  if (!item) {
    return null; // Return null if no data is provided
  }

  const discountedPrice = item.originalPrice
    ? (item.originalPrice * (1 - item.discount / 100)).toFixed(2)
    : item.price || item.pricing?.fixedPrice || 0;

  const handleBuyClick = (e) => {
    e.preventDefault();
    if (onBuyClick) {
      onBuyClick(item);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${item._id}`} className="product-card-link">
        <div className="product-image">
          {item.images && item.images.length > 0 ? (
            <img src={item.images[0]?.url || item.images[0]} alt={item.title} />
          ) : (
            <div className="no-image">No Image</div>
          )}
          {item.discount > 0 && <span className="discount-badge">{item.discount}%</span>}
        </div>

        <div className="product-info">
          <h3 className="product-title">{item.title}</h3>

          <div className="product-shop">
            <span>🏪 {item.shop?.shopName || 'Store'}</span>
          </div>

          <div className="product-price">
            <span className="current-price">${discountedPrice}</span>
            {item.originalPrice && (
              <span className="original-price">${item.originalPrice}</span>
            )}
          </div>

          <div className="product-meta">
            <span className="rating">⭐ {item.rating || 0}</span>
            <span className="sold">Sold: {item.sold || 0}</span>
          </div>

          <div className="product-stock">
            {(item.stock || item.totalQuantity || 0) > 0 ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>

      {onBuyClick && (
        <button
          className="btn-buy"
          onClick={handleBuyClick}
          disabled={(item.stock || item.totalQuantity || 0) === 0}
        >
          {(item.stock || item.totalQuantity || 0) > 0 ? 'Buy Now' : 'Out of Stock'}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
