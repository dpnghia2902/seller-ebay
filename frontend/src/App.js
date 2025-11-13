// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/seller/SellerDashboard';
import ListingForm from './pages/seller/ListingForm';
import VerificationForm from './pages/seller/VerificationForm';
import StoreSubscription from './pages/seller/StoreSubscription';
import StoreSetup from './pages/seller/StoreSetup';
import Orders from './pages/seller/Orders';
import SellerReviews from './pages/seller/SellerReviews';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Seller routes */}
                        <Route
                            path="/seller"
                            element={
                                <ProtectedRoute requireSeller>
                                    <SellerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/verify"
                            element={
                                <ProtectedRoute requireSeller>
                                    <VerificationForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/list-item"
                            element={
                                <ProtectedRoute requireSeller requireVerified>
                                    <ListingForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/orders"
                            element={
                                <ProtectedRoute requireSeller requireVerified>
                                    <Orders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/reviews"
                            element={
                                <ProtectedRoute requireSeller requireVerified>
                                    <SellerReviews />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/store/subscription"
                            element={
                                <ProtectedRoute requireSeller requireVerified>
                                    <StoreSubscription />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/store/setup"
                            element={
                                <ProtectedRoute requireSeller requireVerified>
                                    <StoreSetup />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
