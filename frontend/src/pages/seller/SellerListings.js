// src/pages/seller/SellerListings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SellerListings = () => {
    const navigate = useNavigate();
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
            {/* Header with Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Seller Hub</h1>
                            <p className="text-gray-600">nguyenvk10 (0)</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Messages (2)
                        </button>
                    </div>

                    <div className="flex space-x-6 border-b -mb-px">
                        <button onClick={() => navigate('/seller')} className="pb-4 text-gray-600 hover:text-gray-900">
                            Overview
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Orders</button>
                        <button className="pb-4 border-b-2 border-blue-600 font-semibold text-blue-600">
                            Listings
                        </button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Marketing</button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Advertising</button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Store</button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Performance</button>
                        <button className="pb-4 text-gray-600 hover:text-gray-900">Payments</button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Manage active listings</h2>
                    <button
                        onClick={() => navigate('/seller/list-item-start')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold"
                    >
                        Create listing
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-48 bg-white rounded-lg p-4 h-fit">
                        {['active', 'unsold', 'drafts', 'scheduled', 'ended'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`w-full text-left px-3 py-2 rounded mb-1 capitalize ${
                                    selectedTab === tab ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg p-4">
                            {/* Search */}
                            <div className="relative mb-4">
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

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-t border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-gray-500">Loading...</td>
                                        </tr>
                                    ) : filteredListings.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12">
                                                <div className="text-gray-900 font-semibold mb-2">
                                                    Looks like you don't have any active listings.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredListings.map((listing) => (
                                            <tr key={listing._id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{listing.title}</td>
                                                <td className="px-4 py-3">{listing.fixedPrice?.toLocaleString()} VND</td>
                                                <td className="px-4 py-3">{listing.totalQuantity}</td>
                                                <td className="px-4 py-3">
                                                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerListings;