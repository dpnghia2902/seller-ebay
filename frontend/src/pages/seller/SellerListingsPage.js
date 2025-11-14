import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SellerListingsPage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('active');
    const [selectedListings, setSelectedListings] = useState([]);
    const [showBanner, setShowBanner] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        loadListings();
    }, [selectedTab]);

    const loadListings = async () => {
        try {
            setLoading(true);
            const listingsRes = await api.get('/listing/my-listings');
            setListings(listingsRes.data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedListings(filteredListings.map(l => l._id));
        } else {
            setSelectedListings([]);
        }
    };

    const handleSelectListing = (id) => {
        setSelectedListings(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.inventorySku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = selectedTab === 'all' ? true : listing.status === selectedTab;
        return matchesSearch && matchesTab;
    });

    const getStatusCounts = () => {
        return {
            all: listings.length,
            active: listings.filter(l => l.status === 'active').length,
            draft: listings.filter(l => l.status === 'draft').length,
            scheduled: listings.filter(l => l.status === 'scheduled').length,
            ended: listings.filter(l => l.status === 'ended').length,
            paused: listings.filter(l => l.status === 'paused').length,
        };
    };

    const counts = getStatusCounts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
                            <p className="text-sm text-gray-600 mt-1">Manage and optimize your active listings</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="text-sm">Notifications</span>
                            </button>
                            <button
                                onClick={() => navigate('/seller/list-item-start')}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create listing</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar */}
                    <div className="w-56 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedTab('all')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'all'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>All listings</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'all' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.all}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedTab('active')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'active'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Active</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.active}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedTab('draft')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'draft'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span>Drafts</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'draft' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.draft}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedTab('scheduled')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'scheduled'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span>Scheduled</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.scheduled}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedTab('paused')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'paused'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span>Paused</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'paused' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.paused}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedTab('ended')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                                        selectedTab === 'ended'
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>Ended</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        selectedTab === 'ended' ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>{counts.ended}</span>
                                </button>
                            </div>

                            <div className="border-t mt-4 pt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                                    Tools & Settings
                                </p>
                                <div className="space-y-1">
                                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Templates</span>
                                    </button>
                                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span>Bulk upload</span>
                                    </button>
                                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Preferences</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Promotion Banner */}
                        {showBanner && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-3xl">🚀</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                Boost your sales with Promoted Listings
                                            </h3>
                                            <p className="text-sm text-gray-700 mb-2">
                                                Increase visibility and drive more traffic to your listings.
                                                Get started today and see results in days.
                                            </p>
                                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline">
                                                Learn more →
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowBanner(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Filters and Search */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Search Bar */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by title, SKU, or item number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
                                    </span>
                                    {selectedListings.length > 0 && (
                                        <span className="text-sm text-blue-600 font-medium">
                                            {selectedListings.length} selected
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {selectedListings.length > 0 && (
                                        <>
                                            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                                                Edit selected
                                            </button>
                                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                                End listings
                                            </button>
                                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                                More actions
                                            </button>
                                        </>
                                    )}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="newest">Newest first</option>
                                        <option value="oldest">Oldest first</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="title">Title: A to Z</option>
                                    </select>
                                    <button className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-10">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Listing
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Sold
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Views
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-16">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                    <p className="text-gray-500">Loading listings...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredListings.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-16">
                                                <div className="flex flex-col items-center space-y-3">
                                                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            No listings found
                                                        </h3>
                                                        <p className="text-gray-600 mb-4">
                                                            {searchTerm
                                                                ? 'Try adjusting your search terms'
                                                                : 'Get started by creating your first listing'}
                                                        </p>
                                                        {!searchTerm && (
                                                            <button
                                                                onClick={() => navigate('/seller/list-item-start')}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                                            >
                                                                Create listing
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredListings.map((listing) => (
                                            <tr
                                                key={listing._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={selectedListings.includes(listing._id)}
                                                        onChange={() => handleSelectListing(listing._id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                            {listing.images && listing.images.length > 0 ? (
                                                                <img
                                                                    src={listing.images[0].url}
                                                                    alt={listing.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">
                                                                {listing.title}
                                                            </h3>
                                                            {listing.subtitle && (
                                                                <p className="text-xs text-gray-500 truncate">{listing.subtitle}</p>
                                                            )}
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                {listing.inventorySku && (
                                                                    <span className="text-xs text-gray-500">
                                                                            SKU: {listing.inventorySku}
                                                                        </span>
                                                                )}
                                                                <span className="text-xs text-gray-400">
                                                                        ID: {listing._id.slice(-6)}
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            listing.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                listing.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                                    listing.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                                        listing.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                                        </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {listing.pricing?.fixedPrice?.toLocaleString('vi-VN')} ₫
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {listing.totalQuantity}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {listing.stats?.soldQuantity || 0}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {listing.stats?.views || 0}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/seller/listing/edit/${listing._id}`)}
                                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button className="p-1 hover:bg-gray-100 rounded">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredListings.length > 0 && (
                                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-700">Rows per page:</span>
                                        <select className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>25</option>
                                            <option>50</option>
                                            <option>100</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-700">
                                            1-{Math.min(25, filteredListings.length)} of {filteredListings.length}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <button className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-gray-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        {filteredListings.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Total Views</span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredListings.reduce((sum, l) => sum + (l.stats?.views || 0), 0)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Total Sold</span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredListings.reduce((sum, l) => sum + (l.stats?.soldQuantity || 0), 0)}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1 font-medium">↑ 12% from last month</p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Avg. Price</span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(filteredListings.reduce((sum, l) => sum + (l.pricing?.fixedPrice || 0), 0) / filteredListings.length).toLocaleString('vi-VN', {maximumFractionDigits: 0})} ₫
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Across all listings</p>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Conversion</span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">3.2%</p>
                                    <p className="text-xs text-green-600 mt-1 font-medium">↑ 0.5% improvement</p>
                                </div>
                            </div>
                        )}

                        {/* Tips Section */}
                        {filteredListings.length > 0 && (
                            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                                            Tips to improve your listings
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start space-x-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Add high-quality photos from multiple angles to increase buyer confidence</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Write detailed descriptions with all item specifics to improve search visibility</span>
                                            </li>
                                            <li className="flex items-start space-x-2">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span>Consider competitive pricing based on similar listings in your category</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerListingsPage;