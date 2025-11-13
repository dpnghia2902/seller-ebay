// src/pages/seller/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SellerDashboard = () => {
    const { user, isVerified } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load listings if verified
            if (isVerified) {
                const listingsRes = await api.get('/listing/my-listings');
                setListings(listingsRes.data);

                // Try to load store
                try {
                    const storeRes = await api.get('/store/my-store');
                    setStore(storeRes.data);
                } catch (err) {
                    // Store doesn't exist yet
                    console.log('No store found');
                }
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleListItem = () => {
        if (!isVerified) {
            navigate('/seller/verify');
            return;
        }

        if (!store) {
            // If no store, redirect to subscription
            navigate('/seller/store/subscription');
            return;
        }

        navigate('/seller/list-item');
    };

    const handleStoreClick = () => {
        if (!isVerified) {
            navigate('/seller/verify');
            return;
        }

        if (!store) {
            navigate('/seller/store/subscription');
        } else {
            // Navigate to store management (you can create this page later)
            alert('Store management page - coming soon!');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My eBay Selling Overview</h1>
                <div className="flex space-x-8 border-b">
                    <button className="pb-4 border-b-2 border-blue-600 font-semibold">
                        Activity
                    </button>
                    <button className="pb-4 text-gray-600">Messages</button>
                    <button className="pb-4 text-gray-600">Account</button>
                </div>
            </div>

            {/* Verification Alert */}
            {!isVerified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Your seller account needs verification.{' '}
                                <Link to="/seller/verify" className="font-medium underline">
                                    Complete verification now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-3xl font-bold">{listings.filter(l => l.status === 'active').length}</div>
                        <div className="text-gray-600 text-sm">Active</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">0</div>
                        <div className="text-gray-600 text-sm">Orders</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">0</div>
                        <div className="text-gray-600 text-sm">Unsold</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">$0.00</div>
                        <div className="text-gray-600 text-sm">90-day total</div>
                    </div>
                </div>
                <button
                    onClick={handleListItem}
                    className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
                >
                    List an item
                </button>
            </div>

            {/* Guides */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">
                    You have something to sell. We have millions of buyers.
                </h2>
                <p className="text-gray-600 mb-6">
                    From listing to getting paid, look at these guides to help you sell and get paid.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-6">
                        <div className="text-3xl mb-4">🏷️</div>
                        <h3 className="font-semibold mb-2">Listing best practices</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            See our guide on best practices for creating listings that sell.
                        </p>
                        <button className="text-blue-600 hover:underline text-sm font-medium">
                            See best practices
                        </button>
                    </div>

                    <div className="border rounded-lg p-6">
                        <div className="text-3xl mb-4">📦</div>
                        <h3 className="font-semibold mb-2">Shipping an item</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Learn about how you can save on shipping with discounted eBay shipping labels and more.
                        </p>
                        <button className="text-blue-600 hover:underline text-sm font-medium">
                            Learn about shipping options
                        </button>
                    </div>

                    <div className="border rounded-lg p-6">
                        <div className="text-3xl mb-4">💰</div>
                        <h3 className="font-semibold mb-2">How fees work</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Learn about the fees for selling on eBay.
                        </p>
                        <button className="text-blue-600 hover:underline text-sm font-medium">
                            Learn about fees
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Selling</h2>
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Overview
                    </button>
                    <button
                        onClick={handleListItem}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                    >
                        Sell an item
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Drafts
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Scheduled
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Active
                    </button>
                    <Link
                        to="/seller/orders"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                    >
                        Orders
                    </Link>
                    <Link
                        to="/seller/reviews"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                    >
                        Customer Reviews
                    </Link>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Unsold
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Payments
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                        Shipping labels
                    </button>
                    <button
                        onClick={handleStoreClick}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded font-medium"
                    >
                        {store ? `My Store: ${store.name}` : 'Create Store'}
                    </button>
                </div>
            </div>

            {/* Active Listings */}
            {isVerified && listings.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Active Listings</h2>
                    <div className="space-y-4">
                        {listings.filter(l => l.status === 'active').map((listing) => (
                            <div key={listing._id} className="border rounded p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{listing.title}</h3>
                                    <p className="text-gray-600 text-sm">{listing.subtitle}</p>
                                    <p className="text-blue-600 font-bold mt-1">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(listing.pricing.fixedPrice)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Quantity: {listing.totalQuantity}</p>
                                    <p className="text-sm text-gray-600">Views: {listing.stats.views}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state for tasks */}
            <div className="mt-8 text-center py-12">
                <div className="inline-block w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Your tasks will live here.</h3>
            </div>
        </div>
    );
};

export default SellerDashboard;