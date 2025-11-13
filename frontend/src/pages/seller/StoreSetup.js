// src/pages/seller/StoreSetup.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const StoreSetup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { planId, planName, billingCycle } = location.state || {};

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/store/create', {
                ...formData,
                planId,
                billingCycle,
            });

            alert('Store created successfully!');
            navigate('/seller');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
        } finally {
            setLoading(false);
        }
    };

    if (!planId) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-600 mb-4">No plan selected</p>
                <button
                    onClick={() => navigate('/seller/store/subscription')}
                    className="text-blue-600 hover:underline"
                >
                    Select a plan
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-2">Set up your eBay Store</h1>
                <p className="text-gray-600 mb-2">Selected Plan: <strong>{planName}</strong></p>
                <p className="text-gray-600 mb-8">Billing: <strong>{billingCycle}</strong></p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="My Awesome Store"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store URL Slug <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2">ebay.com/str/</span>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="my-awesome-store"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            URL-friendly version of your store name
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell customers about your store..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/seller/store/subscription')}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreSetup;