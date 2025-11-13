// src/pages/seller/ListingForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ListingForm = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        categoryId: '',
        condition: 'new',
        description: '',
        inventorySku: '',
        fixedPrice: '',
        totalQuantity: 1,
        itemSpecifics: [{ name: '', value: '' }],
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await api.get('/public/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Filter out empty item specifics
            const itemSpecifics = formData.itemSpecifics.filter(
                spec => spec.name && spec.value
            );

            await api.post('/listing/create', {
                ...formData,
                itemSpecifics,
                fixedPrice: parseFloat(formData.fixedPrice),
                totalQuantity: parseInt(formData.totalQuantity),
            });

            alert('Listing created successfully!');
            navigate('/seller');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    const addItemSpecific = () => {
        setFormData({
            ...formData,
            itemSpecifics: [...formData.itemSpecifics, { name: '', value: '' }],
        });
    };

    const updateItemSpecific = (index, field, value) => {
        const updated = [...formData.itemSpecifics];
        updated[index][field] = value;
        setFormData({ ...formData, itemSpecifics: updated });
    };

    const removeItemSpecific = (index) => {
        const updated = formData.itemSpecifics.filter((_, i) => i !== index);
        setFormData({ ...formData, itemSpecifics: updated });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Complete your listing</h1>
                    <p className="text-gray-600">
                        Fill in the details about your item to create a listing
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title & Category */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Item Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Apple iPhone 15 Pro Max 256GB - Blue"
                                    maxLength="80"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.title.length}/80 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtitle (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add a subtitle to highlight key features"
                                    maxLength="55"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Photos (Placeholder) */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Photos & Media</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">Drag and drop files</p>
                            <p className="text-sm text-gray-500 mt-1">
                                (Photo upload feature - to be implemented)
                            </p>
                        </div>
                    </div>

                    {/* Item Specifics */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Item Specifics</h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="new">New</option>
                                    <option value="like_new">Like New</option>
                                    <option value="used_excellent">Used - Excellent</option>
                                    <option value="used_good">Used - Good</option>
                                    <option value="used_fair">Used - Fair</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.inventorySku}
                                    onChange={(e) => setFormData({ ...formData, inventorySku: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., IPH15-BLU-256"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Additional Specifications
                            </label>
                            {formData.itemSpecifics.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={spec.name}
                                        onChange={(e) => updateItemSpecific(index, 'name', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Color, Brand, Model"
                                    />
                                    <input
                                        type="text"
                                        value={spec.value}
                                        onChange={(e) => updateItemSpecific(index, 'value', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Blue, Apple, iPhone 15"
                                    />
                                    {formData.itemSpecifics.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItemSpecific(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItemSpecific}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                + Add another specification
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Describe your item in detail. Include any flaws, special features, or additional information buyers should know..."
                        />
                    </div>

                    {/* Pricing */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Pricing</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="1000"
                                    value={formData.fixedPrice}
                                    onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="299000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.totalQuantity}
                                    onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping (Info only) */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                ℹ️ Your store's default shipping policy will be applied to this listing.
                            </p>
                        </div>
                    </div>

                    {/* Final Details */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Final Details</h2>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Listing Type:</span>
                                <span className="font-medium">Fixed Price</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">Good 'til cancelled</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Listing Fee:</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/seller')}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold"
                        >
                            {loading ? 'Creating Listing...' : 'List Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListingForm;