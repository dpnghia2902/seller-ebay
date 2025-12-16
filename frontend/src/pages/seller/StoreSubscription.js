// src/pages/seller/StoreSubscription.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const StoreSubscription = () => {
    const { refreshUser } = useAuth();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const navigate = useNavigate();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const response = await api.get('/store/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Error loading plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = async (plan) => {
        setSelectedPlan(plan);

        try {
            await refreshUser();

            const verify = await api.get('/seller/profile').catch(() => null);
            console.log(verify)
            if (!verify?.data || verify?.data?.status !== 'verified') {
                console.log('Navigating to verify due to unverified profile');
                return navigate('/seller/verify', {
                    state: { planId: plan._id, planName: plan.name, billingCycle }
                });
            }
            console.log('Navigating to store setup');
            navigate('/seller/store/setup', {
                state: { planId: plan._id, planName: plan.name, billingCycle }
            });
        } catch (error) {
            console.log(error);
            navigate('/seller/verify', {
                state: { planId: plan._id, planName: plan.name, billingCycle }
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading plans...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Review Store plans</h1>
                    <p className="text-gray-600">Choose the plan that fits your business needs</p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-2 shadow">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-md ${
                                billingCycle === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-md ${
                                billingCycle === 'yearly'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700'
                            }`}
                        >
                            Yearly (Save up to 20%)
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const price = billingCycle === 'yearly'
                            ? (plan.yearlyPrice / 12).toFixed(2)
                            : plan.monthlyPrice;

                        return (
                            <div
                                key={plan._id}
                                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
                            >
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold">${price}</span>
                                    <span className="text-gray-600">/mo</span>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-sm text-green-600 mt-1">
                                            with 1-yr plan*
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 mb-6"
                                >
                                    Subscribe Now
                                </button>

                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4">Features:</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm">
                        {plan.maxActiveListings === -1
                            ? 'Unlimited listings'
                            : `Up to ${plan.maxActiveListings} active listings`}
                      </span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm">
                        {plan.freeListingsPerMonth} free listings per month
                      </span>
                                        </li>
                                        {plan.discountOnFeesPercent > 0 && (
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm">
                          {plan.discountOnFeesPercent}% discount on fees
                        </span>
                                            </li>
                                        )}
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm capitalize">
                          {feature.replace(/_/g, ' ')}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center text-gray-600">
                    <p className="mb-4">Not ready to subscribe? You can still list items individually.</p>
                    <button
                        onClick={() => navigate('/seller')}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Back to Seller Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreSubscription;