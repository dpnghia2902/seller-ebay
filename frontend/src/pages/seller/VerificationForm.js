// src/pages/seller/VerificationForm.js
import React, { useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
const VerificationForm = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [existingProfile, setExistingProfile] = useState(null);
    const [formData, setFormData] = useState({
        legalName: '',
        businessType: 'individual',
        businessRegistrationNumber: '',
        taxId: '',
        contactPhone: '',
        contactEmail: user?.email || '',
        payoutMethod: 'bank',
        bankName: '',
        accountNumberMasked: '',
        accountHolder: '',
        paypalEmail: '',
    });
    const location = useLocation();
    const { planId, planName, billingCycle } = location.state || {};
    useEffect(() => {
        loadSellerProfile();
    }, []);

    const loadSellerProfile = async () => {
        try {
            const response = await api.get('/seller/profile');
            setExistingProfile(response.data);

            // Pre-fill form with existing data
            if (response.data) {
                setFormData({
                    legalName: response.data.legalName || '',
                    businessType: response.data.businessType || 'individual',
                    businessRegistrationNumber: response.data.businessRegistrationNumber || '',
                    taxId: response.data.taxId || '',
                    contactPhone: response.data.contact?.phone || '',
                    contactEmail: response.data.contact?.email || user?.email || '',
                    payoutMethod: response.data.payoutAccount?.method || 'bank',
                    bankName: response.data.payoutAccount?.bankName || '',
                    accountNumberMasked: response.data.payoutAccount?.accountNumberMasked || '',
                    accountHolder: response.data.payoutAccount?.accountHolder || '',
                    paypalEmail: response.data.payoutAccount?.paypalEmail || '',
                });
            }
        } catch (error) {
            // No profile exists yet, that's okay
            console.log('No existing profile');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                legalName: formData.legalName,
                businessType: formData.businessType,
                businessRegistrationNumber: formData.businessRegistrationNumber,
                taxId: formData.taxId,
                contact: {
                    phone: formData.contactPhone,
                    email: formData.contactEmail,
                },
                payoutAccount: {
                    method: formData.payoutMethod,
                    ...(formData.payoutMethod === 'bank' && {
                        bankName: formData.bankName,
                        accountNumberMasked: formData.accountNumberMasked,
                        accountHolder: formData.accountHolder,
                    }),
                    ...(formData.payoutMethod === 'paypal' && {
                        paypalEmail: formData.paypalEmail,
                    }),
                },
            };

            await api.post('/seller/verify', payload);
            await refreshUser();
            if (planId) {
                return navigate('/seller/store/setup', {
                    state: { planId, planName, billingCycle }
                });
            }

            navigate('/seller');
            alert('Verification request submitted successfully! We will review your information shortly.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit verification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Seller Verification</h1>
                    <p className="text-gray-600">
                        Complete your seller verification to start listing items on eBay.
                    </p>

                    {existingProfile && (
                        <div className={`mt-4 p-4 rounded ${
                            existingProfile.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                                existingProfile.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                                    'bg-gray-50 border border-gray-200'
                        }`}>
                            <p className="font-semibold">
                                Status: <span className="capitalize">{existingProfile.status}</span>
                            </p>
                            {existingProfile.reviewNote && (
                                <p className="text-sm mt-1">{existingProfile.reviewNote}</p>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Information */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Business Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Legal Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.legalName}
                                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your full legal name or business name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.businessType}
                                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="individual">Individual</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Registration Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.businessRegistrationNumber}
                                    onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="If applicable"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tax ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your tax identification number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+84 xxx xxx xxx"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payout Account */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">Payout Account</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payout Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.payoutMethod}
                                onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="bank">Bank Account</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>

                        {formData.payoutMethod === 'bank' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bank Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Vietcombank, ACB"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Number (last 4 digits) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="4"
                                        value={formData.accountNumberMasked}
                                        onChange={(e) => setFormData({ ...formData, accountNumberMasked: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Last 4 digits"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Holder Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.accountHolder}
                                        onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Name on bank account"
                                    />
                                </div>
                            </div>
                        )}

                        {formData.payoutMethod === 'paypal' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PayPal Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.paypalEmail}
                                    onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your-paypal@email.com"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
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
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit for Verification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerificationForm;