import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock API - replace with actual API calls
const api = {
    get: async (url) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        if (url === '/listing/my-listings') {
            return { data: [] };
        }
        return { data: [] };
    }
};

const SellerListingsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('active');

    useEffect(() => {
        loadListings();
    }, [selectedTab]);

    const loadListings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/listing/my-listings');
            setListings(response.data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = selectedTab === 'active' ? listing.status === 'active' : true;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Seller Hub</h1>
                            <p className="text-gray-600">nguyenvk10 (0)</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
                            <span>Messages (2)</span>
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-6 border-b -mb-px">
                        <button
                            onClick={() => navigate('/seller')}
                            className="pb-4 text-gray-600 hover:text-gray-900"
                        >
                            Overview
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Orders
                        </button>
                        <button className="pb-4 border-b-2 border-blue-600 font-semibold text-blue-600">
                            Listings
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Marketing
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
                            Advertising
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">
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
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="text-sm">Collapse</span>
                    </div>
                    <h2 className="text-2xl font-bold">Manage active listings</h2>
                    <button
                        onClick={() => navigate('/seller/list-item-start')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold"
                    >
                        Create listing
                    </button>
                </div>

                {/* Sidebar and Content */}
                <div className="flex gap-6">
                    {/* Left Sidebar */}
                    <div className="w-48 bg-white rounded-lg p-4 h-fit">
                        <button
                            onClick={() => setSelectedTab('active')}
                            className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                selectedTab === 'active' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setSelectedTab('unsold')}
                            className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                selectedTab === 'unsold' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                            }`}
                        >
                            Unsold
                        </button>
                        <button
                            onClick={() => setSelectedTab('drafts')}
                            className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                selectedTab === 'drafts' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                            }`}
                        >
                            Drafts
                        </button>
                        <button
                            onClick={() => setSelectedTab('scheduled')}
                            className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                selectedTab === 'scheduled' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                            }`}
                        >
                            Scheduled
                        </button>
                        <button
                            onClick={() => setSelectedTab('ended')}
                            className={`w-full text-left px-3 py-2 rounded mb-1 ${
                                selectedTab === 'ended' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                            }`}
                        >
                            Ended
                        </button>

                        <div className="border-t mt-4 pt-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">SETTINGS</p>
                            <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50">
                                Selling preferences
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50">
                                Listing templates
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50">
                                Business policies
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Promotion Banner */}
                        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">📢</div>
                                <div>
                                    <p className="font-semibold">Reach more buyers off eBay</p>
                                    <p className="text-sm text-gray-600">
                                        Get started with Promoted Offsite to help increase{' '}
                                        <span className="text-blue-600 underline">clicks up to 65%</span>.
                                    </p>
                                    <button className="text-blue-600 text-sm font-semibold underline mt-1">
                                        Start now
                                    </button>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Search by title, SKU, or item number"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold">Results: {filteredListings.length}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        Customize table
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        Download
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                        Upload
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mb-4">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                                    Edit
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Sell similar
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Actions
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Sell it faster
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-t border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <input type="checkbox" className="rounded" />
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Item #</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Custom label (SKU)</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Current price</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Discounts</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Available quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Views (30 days)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-12">
                                                <div className="text-gray-500">Loading...</div>
                                            </td>
                                        </tr>
                                    ) : filteredListings.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-12">
                                                <div className="text-gray-900 font-semibold mb-2">
                                                    Looks like you don't have any active listings.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredListings.map((listing) => (
                                            <tr key={listing._id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" className="rounded" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{listing.listingId}</td>
                                                <td className="px-4 py-3 text-sm">{listing.inventorySku || '-'}</td>
                                                <td className="px-4 py-3 text-sm">{listing.fixedPrice?.toLocaleString()} VND</td>
                                                <td className="px-4 py-3 text-sm">-</td>
                                                <td className="px-4 py-3 text-sm">{listing.totalQuantity}</td>
                                                <td className="px-4 py-3 text-sm">0</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-end mt-4 space-x-4">
                                <span className="text-sm text-gray-600">Items per page</span>
                                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                                    <option>50</option>
                                    <option>100</option>
                                    <option>200</option>
                                </select>
                                <button className="p-2 hover:bg-gray-100 rounded">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerListingsPage;