// src/pages/seller/ListItemStart.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockSuggestions = [
    { title: 'Apple iPhone 15 Pro Max', category: 'Cell Phones & Smartphones' },
    { title: 'Apple iPhone 15 Pro', category: 'Cell Phones & Smartphones' },
    { title: 'Apple iPhone 15', category: 'Cell Phones & Smartphones' },
    { title: 'Samsung Galaxy S24 Ultra', category: 'Cell Phones & Smartphones' },
    { title: 'Apple AirPods Pro', category: 'Headphones' },
];

const ListItemStart = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchInput = (value) => {
        setSearchQuery(value);

        if (value.trim().length > 2) {
            const filtered = mockSuggestions.filter(item =>
                item.title.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSearch = (query = searchQuery) => {
        if (query.trim()) {
            navigate('/seller/list-item', { state: { searchQuery: query } });
        }
    };

    const selectSuggestion = (title) => {
        setSearchQuery(title);
        setShowSuggestions(false);
        handleSearch(title);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-blue-600">eBay</h1>
                        <span className="text-xl font-semibold">Seller Hub</span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-3">Start listing with item info</h1>
                    <p className="text-gray-600">Describe your item, and we'll start your listing based on items in our catalog.</p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter brand, model, description, etc."
                            className="w-full px-4 py-4 pr-32 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                        />
                        <button
                            onClick={() => handleSearch()}
                            className="absolute right-2 top-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Search
                        </button>
                    </div>

                    {/* Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectSuggestion(item.title)}
                                    className="p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-200"
                                >
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-gray-600">{item.category}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alternative Methods */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-6">More ways to start listing</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Photo Upload */}
                        <button className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow text-left border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">Photo upload</h3>
                            <p className="text-sm text-gray-600">Add photos for multiple items to generate item details.</p>
                            <svg className="w-5 h-5 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* File Upload */}
                        <button className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow text-left border border-gray-200">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">File upload</h3>
                            <p className="text-sm text-gray-600">Import a CSV or XLSX file with info about your inventory.</p>
                            <svg className="w-5 h-5 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Bulk Listing */}
                        <button className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow text-left border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6m-7 12h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">Bulk listing</h3>
                            <p className="text-sm text-gray-600">Create thousands of similar listings with bulk actions.</p>
                            <svg className="w-5 h-5 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Drafts & Templates */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Drafts */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Drafts</h2>
                            <button className="text-blue-600 hover:underline text-sm">View all drafts</button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Finish drafts you've already created</p>

                        <div className="space-y-3">
                            {['apple watch', 'apple watch', 'Giày'].map((draft, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 relative">
                                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{draft}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Templates */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Templates</h2>
                            <button className="text-blue-600 hover:underline text-sm">View templates</button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Use a template to start listing</p>

                        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                            <p className="text-gray-600 mb-2">You currently do not have any listing templates.</p>
                            <button className="text-blue-600 hover:underline text-sm">Manage your listing templates</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListItemStart;