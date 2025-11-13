// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ listing }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg border hover:shadow-xl transition-shadow cursor-pointer group overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                    <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Badges */}
                {listing.isFeatured && (
                    <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              20% OFF: TOPGIFTPICKS
            </span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm group-hover:text-blue-600">
                    {listing.title}
                </h3>

                {listing.subtitle && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{listing.subtitle}</p>
                )}

                <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(listing.pricing.fixedPrice)}
          </span>
                    {listing.isFeatured && (
                        <span className="text-xs text-gray-500 line-through">
              {formatPrice(listing.pricing.fixedPrice * 1.25)}
            </span>
                    )}
                </div>

                {listing.condition && (
                    <p className="text-xs text-gray-500 mb-1 capitalize">
                        {listing.condition.replace(/_/g, ' ')}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-xs text-gray-500">
            {listing.totalQuantity} available
          </span>
                    <span className="text-xs text-green-600 font-medium">Free shipping</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;