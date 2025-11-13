
// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isSeller } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <nav className="bg-white border-b shadow-sm">
        {/* Top Bar */}
        <div className="border-b bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10 text-xs">
              <div className="flex space-x-4 text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer">Hi {isAuthenticated ? user.name : 'Guest'}!</span>
                <Link to="/deals" className="hover:text-blue-600">Daily Deals</Link>
                <Link to="/outlet" className="hover:text-blue-600">Brand Outlet</Link>
                <Link to="/gift-cards" className="hover:text-blue-600">Gift Cards</Link>
                <Link to="/help" className="hover:text-blue-600">Help & Contact</Link>
              </div>
              <div className="flex space-x-4 text-gray-600">
                {isAuthenticated ? (
                    <>
                      {isSeller && (
                          <Link to="/seller" className="hover:text-blue-600 font-medium">
                            Sell
                          </Link>
                      )}
                      <Link to="/watchlist" className="hover:text-blue-600">Watchlist</Link>
                      <Link to="/my-ebay" className="hover:text-blue-600">My eBay</Link>
                      <button onClick={handleLogout} className="hover:text-blue-600">
                        Sign out
                      </button>
                    </>
                ) : (
                    <>
                      <Link to="/register" className="hover:text-blue-600">register</Link>
                      <Link to="/login" className="hover:text-blue-600">Sign in</Link>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <svg className="w-24 h-10" viewBox="0 0 100 40" fill="none">
                <text x="0" y="30" fontSize="28" fontWeight="bold" fill="#e53238">eBay</text>
              </svg>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-8">
              <div className="flex">
                <input
                    type="text"
                    placeholder="Search for anything"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
                />
                <select className="px-4 py-2.5 border-t-2 border-b-2 border-gray-300 bg-white text-sm text-gray-600 focus:outline-none">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                </select>
                <button className="bg-blue-600 text-white px-8 py-2.5 rounded-r-full hover:bg-blue-700 font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link to="/advanced" className="text-xs text-blue-600 hover:underline">
                Advanced
              </Link>
              <button className="relative p-2 hover:bg-gray-100 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 overflow-x-auto py-3 text-sm">
              <Link to="/shop" className="text-gray-700 hover:text-blue-600 whitespace-nowrap font-medium">
                Shop by category
              </Link>
              <Link to="/saved" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Saved</Link>
              <Link to="/electronics" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Electronics</Link>
              <Link to="/motors" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Motors</Link>
              <Link to="/fashion" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Fashion</Link>
              <Link to="/collectibles" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Collectibles and Art</Link>
              <Link to="/sports" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Sports</Link>
              <Link to="/health" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Health & Beauty</Link>
              <Link to="/industrial" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Industrial equipment</Link>
              <Link to="/home" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Home & Garden</Link>
              <Link to="/deals" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Deals</Link>
              {!isSeller && (
                  <Link to="/register?role=seller" className="text-gray-700 hover:text-blue-600 whitespace-nowrap border-l pl-6">
                    Sell
                  </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;