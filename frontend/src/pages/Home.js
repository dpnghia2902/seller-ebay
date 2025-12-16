// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedListings();
    }, []);

    const loadFeaturedListings = async () => {
        try {
            const response = await axios.get('/api/public/featured');
            setFeaturedListings(response.data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'Laptops', icon: '💻' },
        { name: 'Computer parts', icon: '⌨️' },
        { name: 'Smartphones', icon: '📱' },
        { name: 'Enterprise networking', icon: '🌐' },
        { name: 'Tablets and eBooks', icon: '📱' },
        { name: 'Storage and blank media', icon: '💾' },
        { name: 'Lenses and filters', icon: '📷' },
    ];

    const trending = [
        { name: 'Tech', icon: '🖥️' },
        { name: 'Motors', icon: '🚗' },
        { name: 'Luxury', icon: '💎' },
        { name: 'Collectibles and art', icon: '🎨' },
        { name: 'Home and garden', icon: '🏡' },
        { name: 'Trading cards', icon: '🃏' },
        { name: 'Health and beauty', icon: '💄' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Snap. Work. Play.</h1>
                        <p className="text-lg md:text-xl mb-8 text-blue-100">
                            Find the electronics that fit your lifestyle.
                        </p>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition shadow-lg">
                            Shop now
                        </button>
                    </div>
                    <div className="flex justify-end mt-8 space-x-8">
                        <div className="text-center">
                            <div className="text-white font-bold hover:underline cursor-pointer">Computers &gt;</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold hover:underline cursor-pointer">Cameras &gt;</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold hover:underline cursor-pointer">Entertainment &gt;</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shopping Made Easy Banner */}
            <div className="bg-gray-100 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Shopping made easy</h2>
                            <p className="text-gray-600 text-sm">
                                Enjoy reliability, secure deliveries and hassle-free returns.
                            </p>
                        </div>
                        <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold hover:bg-gray-800 transition text-sm">
                            Start now
                        </button>
                    </div>
                </div>
            </div>

            {/* The Future in Your Hands */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold mb-8">The future in your hands</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition p-6 text-center group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                                {category.icon}
                            </div>
                            <p className="font-medium text-sm text-gray-700">{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending on eBay */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
                <h2 className="text-2xl font-bold mb-8">Trending on eBay</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {trending.map((item) => (
                        <div
                            key={item.name}
                            className="bg-gray-50 rounded-full aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition p-4"
                        >
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <p className="font-medium text-sm text-center text-gray-700">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Deals */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Today's Deals</h2>
                        <p className="text-gray-600 mt-1">All with free shipping</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : featuredListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {featuredListings.map((listing) => (
                            <ProductCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                        <p className="text-gray-500 mb-4">No deals available right now</p>
                        <p className="text-sm text-gray-400">Check back soon for amazing offers!</p>
                    </div>
                )}
            </div>

            {/* Catch Today's Flash Offers */}
            <div className="bg-gray-50 py-16 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-2">Catch today's flash offers.</h2>
                    <p className="text-gray-600 mb-8">Shop eBay Deals that move fast.</p>
                    <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                        Grab your Deal
                    </button>
                </div>
            </div>

            {/* Shopping Made Easy - Bottom */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Shopping made easy</h2>
                            <p className="text-gray-600 mb-6">
                                Enjoy reliability, secure deliveries and hassle-free returns.
                            </p>
                            <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                                Start now
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-100 rounded-lg p-8"></div>
                            <div className="bg-pink-100 rounded-lg p-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;