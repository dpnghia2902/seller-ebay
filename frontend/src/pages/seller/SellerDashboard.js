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
            if (isVerified) {
                const listingsRes = await api.get('/listing/my-listings');
                setListings(listingsRes.data);

                try {
                    const storeRes = await api.get('/store/my-store');
                    setStore(storeRes.data);
                } catch (err) {
                    console.log('No store found');
                }
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    const activeListings = listings.filter(l => l.status === 'active').length;
    const totalSales = listings.reduce((sum, l) => sum + (l.stats.soldQuantity || 0), 0);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👤</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-gray-600">
                                    <Link to="/username" className="text-blue-600 hover:underline">
                                        {user.email.split('@')[0]}
                                    </Link>
                                    {' '}(0)
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/seller/list-item-start"
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700"
                        >
                            Create listing
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 border-b -mb-px">
                        <button className="pb-4 border-b-2 border-blue-600 font-semibold text-blue-600">
                            Overview
                        </button>
                        <button

                            onClick={() => navigate('/seller/orders')}
                            className="pb-4 text-gray-600 hover:text-gray-900">
                            Orders
                        </button>
                        <button
                            onClick={() => navigate('/seller/listings')}
                            className="pb-4 text-gray-600 hover:text-gray-900"
                        >
                            Listings
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Marketing
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Advertising
                        </button>
                        <button
                            onClick={() => store ? alert('Store page') : navigate('/seller/store/subscription')}
                            className="pb-4 text-gray-600 hover:text-gray-900"
                        >
                            Store
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Performance
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Payments
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Research
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Verification Alert */}
                {!isVerified && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <div className="text-green-600 mr-3">✓</div>
                            <div>
                                <p className="font-semibold">You're all caught up!</p>
                                <p className="text-sm text-gray-700">
                                    New tasks, like orders to ship or offers to review, will show up here.{' '}
                                    <Link to="/seller/verify" className="text-blue-600 hover:underline">
                                        Complete verification
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Listings Card */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="font-semibold mb-4 flex items-center justify-between">
                                    Listings
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <Link to="/seller/list-item-start" className="block mb-4">
                                    <button className="w-full text-left bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded">
                                        Create listing
                                    </button>
                                </Link>
                                <div className="space-y-2">
                                    <Link to="/seller/drafts" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Drafts</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/listings?status=active" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Active listings</span>
                                        <span>{activeListings}</span>
                                    </Link>
                                    <Link to="/seller/listings?questions=true" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>With questions</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/listings?offers=true" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>With open offers from buyers</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/all-auctions" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>All auctions</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/auctions-ending" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Auctions ending today</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/buy-it-now" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Buy It Now remaining today</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/scheduled" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Scheduled listings</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/unsold" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Unsold and not relisted</span>
                                        <span>0</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Orders Card */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="font-semibold mb-4 flex items-center justify-between">
                                    Orders
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <div className="space-y-2">
                                    <Link to="/seller/orders/all" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>See all orders</span>
                                        <span></span>
                                    </Link>
                                    <Link to="/seller/orders/awaiting-shipment" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Awaiting shipment - print shipping label</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/orders/open-returns" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>All open returns/replacements</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/orders/open-cancellations" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Open cancellations</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/orders/awaiting-payment" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Awaiting payment</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/orders/shipped-awaiting-feedback" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Shipped awaiting your feedback</span>
                                        <span>0</span>
                                    </Link>
                                    <Link to="/seller/orders/combined-purchases" className="flex justify-between text-sm hover:text-blue-600">
                                        <span>Orders eligible for combined purchases</span>
                                        <span>0</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sales Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center">
                                    Sales
                                    <svg className="w-5 h-5 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-4">Chart for sales data across 31 days</div>

                            {/* Simple chart placeholder */}
                            <div className="h-48 bg-gray-50 rounded flex items-center justify-center mb-4">
                                <span className="text-gray-400">Sales chart</span>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Today</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Last 7 days</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Last 31 days</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Last 90 days</span>
                                    <span>$0.00</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Data for Oct 14 - Nov 13 at 12:53am PST. Percentage change relative to prior period.
                                Performance statistics are recorded to the nearest tenth.
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Advertising Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Advertising</h3>
                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">NEW</span>
                            </div>
                            <div className="mb-4">
                                <img src="/ad-illustration.png" alt="Advertising" className="w-full" onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="bg-gray-100 h-32 rounded flex items-center justify-center"><span class="text-4xl">📊</span></div>';
                                }} />
                            </div>
                            <h4 className="font-semibold mb-2">Reach more buyers</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                eBay Advertising connects you with more buyers around the world with simple-to-use,
                                high-performing solutions designed to fit your budget and campaign needs.
                            </p>
                            <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-full hover:bg-blue-50">
                                Get started
                            </button>
                        </div>

                        {/* Traffic Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold mb-4 flex items-center justify-between">
                                Traffic
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Listing impressions</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-2xl font-bold">0</span>
                                        <span className="text-sm text-gray-500 ml-2">0.0%</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Click-through rate</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-sm">0.0%</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Listing page views</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-2xl font-bold">0</span>
                                        <span className="text-sm text-gray-500 ml-2">0.0%</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Sales conversion rate</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-sm">0.0%</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Data for Oct 14 - Nov 13 at 12:53am PST. Percentage change relative to prior period.
                                Performance statistics are recorded to the nearest tenth.
                            </p>
                        </div>

                        {/* Seller Level */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold mb-4 flex items-center justify-between">
                                Seller level (Region: US)
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </h3>
                            <p className="text-sm text-gray-600">No seller level information available.</p>
                            <button className="mt-4 text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Sections */}
                <div className="grid lg:grid-cols-3 gap-6 mt-6">
                    {/* Feedback */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Feedback</h3>
                            <span className="text-sm">(0)</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium">Last 30 days</p>
                            <div className="flex items-center space-x-2">
                                <span className="text-green-600">😊</span>
                                <span>0 Positive</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-400">😐</span>
                                <span>0 Neutral</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-red-600">😞</span>
                                <span>0 Negative</span>
                            </div>
                            <Link to="/seller/feedback" className="text-blue-600 hover:underline text-sm block mt-4">
                                Feedback for buyers
                            </Link>
                            <Link to="/seller/feedback/leave" className="text-blue-600 hover:underline text-sm block">
                                Leave feedback
                            </Link>
                        </div>
                    </div>

                    {/* Shortcuts */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Shortcuts</h3>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <Link to="/cancel-bids" className="block text-gray-700 hover:text-blue-600">Cancel bids</Link>
                            <Link to="/block-bidders" className="block text-gray-700 hover:text-blue-600">Block bidders</Link>
                            <Link to="/site-preferences" className="block text-gray-700 hover:text-blue-600">Site preferences</Link>
                            <Link to="/selling-discussion-board" className="block text-gray-700 hover:text-blue-600">Selling discussion board</Link>
                            <Link to="/seller-center" className="block text-gray-700 hover:text-blue-600">Seller Center</Link>
                            <Link to="/report-buyer" className="block text-gray-700 hover:text-blue-600">Report a buyer</Link>
                            <Link to="/shipping-supplies" className="block text-gray-700 hover:text-blue-600">eBay Shipping Supplies</Link>
                            <Link to="/purchase-history" className="block text-gray-700 hover:text-blue-600">Purchase history</Link>
                            <Link to="/watch-list" className="block text-gray-700 hover:text-blue-600">Watch list</Link>
                        </div>
                    </div>

                    {/* Selling Tools */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">Selling tools</h3>
                        <div className="space-y-2 text-sm">
                            <Link to="/subscriptions" className="block text-gray-700 hover:text-blue-600">Subscriptions</Link>
                            <Link to="/merchant-integration" className="block text-gray-700 hover:text-blue-600">Merchant Integration Platform</Link>
                            <Link to="/quickbooks" className="block text-gray-700 hover:text-blue-600">Intuit QuickBooks Online</Link>
                            <Link to="/seller-capital" className="block text-gray-700 hover:text-blue-600">eBay Seller Capital</Link>
                            <Link to="/my-ebay-selling" className="block text-gray-700 hover:text-blue-600">View My eBay Selling</Link>
                            <Link to="/seller-hub-reports" className="block text-gray-700 hover:text-blue-600">Seller Hub Reports</Link>
                            <Link to="/automate-feedback" className="block text-gray-700 hover:text-blue-600">Automate feedback</Link>
                            <Link to="/reporting" className="block text-gray-700 hover:text-blue-600">Reporting</Link>
                            <Link to="/seller-dashboard" className="block text-gray-700 hover:text-blue-600">Seller Dashboard</Link>
                            <Link to="/seller-toolbox" className="block text-gray-700 hover:text-blue-600">Sellers toolbox</Link>
                            <Link to="/3rd-party-applications" className="block text-gray-700 hover:text-blue-600">3rd party applications</Link>
                            <Link to="/time-away" className="block text-gray-700 hover:text-blue-600">Time Away</Link>
                        </div>
                    </div>
                </div>

                {/* Announcements */}
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4 flex items-center justify-between">
                            Selling announcements
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </h3>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-gray-500 text-xs">Nov 12</p>
                                <Link to="/announcement/1" className="text-blue-600 hover:underline">
                                    List Smarter, Sell More This Holiday Season
                                </Link>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-500 text-xs">Nov 5</p>
                                <Link to="/announcement/2" className="text-blue-600 hover:underline">
                                    Your November Seller News is here
                                </Link>
                            </div>
                        </div>
                        <Link to="/announcements/all" className="text-blue-600 hover:underline text-sm block mt-4">
                            See all announcements
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">Promotional offers</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-sm mb-1">List up to 250 items for FREE every Month!</p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Pay no insertion fees on 250 auction-style or fixed price listings.
                                </p>
                                <p className="text-xs text-gray-500">Ends Dec 1, 2025 at 12:00am PDT</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Used/Left: 0 /250</p>
                                <Link to="/promotional-offers" className="text-blue-600 hover:underline text-sm">
                                    See details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;