// src/pages/seller/SellerReviews.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const SellerReviews = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  
  // Filters
  const [filters, setFilters] = useState({
    rating: '',
    status: 'published',
    sort: 'newest',
    search: '',
    hasResponse: '',
  });

  // Response modal state
  const [responseModal, setResponseModal] = useState({ open: false, review: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    loadStatistics();
  }, [filters, pagination.page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      const response = await api.get('/seller/reviews', { params });
      setReviews(response.data.reviews);
      setPagination(response.data.pagination);
      setStatistics(response.data.statistics);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await api.get('/seller/reviews/statistics');
      setStatistics(response.data);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRespond = (review) => {
    setResponseModal({
      open: true,
      review,
      message: review.sellerResponse?.message || '',
    });
  };

  const handleSubmitResponse = async () => {
    if (!responseModal.message.trim()) {
      alert('Please enter a response message');
      return;
    }

    // Check if review already has a response
    if (responseModal.review.sellerResponse?.message) {
      alert('You have already responded to this review. Each review can only have one response.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/seller/reviews/${responseModal.review._id}/respond`, { message: responseModal.message });
      setResponseModal({ open: false, review: null, message: '' });
      loadReviews();
      loadStatistics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && !reviews.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>
        <p className="text-gray-600">
          Manage and respond to customer reviews for your listings
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{statistics.totalReviews}</div>
            <div className="text-gray-600 text-sm">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">
              {statistics.averageRating.toFixed(1)} ⭐
            </div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{statistics.respondedCount}</div>
            <div className="text-gray-600 text-sm">Responded</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold">{statistics.responseRate}%</div>
            <div className="text-gray-600 text-sm">Response Rate</div>
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {statistics && statistics.ratingDistribution && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = statistics.ratingDistribution[rating] || 0;
              const percentage =
                statistics.totalReviews > 0
                  ? (count / statistics.totalReviews) * 100
                  : 0;
              return (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm">{rating} ⭐</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Response</label>
            <select
              value={filters.hasResponse}
              onChange={(e) => handleFilterChange('hasResponse', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="true">With Response</option>
              <option value="false">No Response</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No reviews found matching your filters.
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-semibold">{review.buyerName || review.buyerUsername || 'Anonymous'}</span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(review.reviewDate)}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                      {review.status === 'hidden' && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>

                    {review.title && (
                      <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                    )}

                    {review.comment && (
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                    )}

                    {review.listingId && (
                      <div className="text-sm text-gray-600 mb-4">
                        <Link
                          to={`/listing/${review.listingId._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {review.listingId.title}
                        </Link>
                      </div>
                    )}

                    {/* Seller Response */}
                    {review.sellerResponse?.message && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                        <div className="font-semibold text-blue-900 mb-1">Your Response</div>
                        <p className="text-blue-800">{review.sellerResponse.message}</p>
                        <div className="text-xs text-blue-600 mt-2">
                          {formatDate(review.sellerResponse.updatedAt || review.sellerResponse.respondedAt)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {review.status === 'published' && !review.sellerResponse?.message && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleRespond(review)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Respond
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} reviews
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {responseModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Respond to Review</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Review:</div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(responseModal.review.rating)}
                </div>
                {responseModal.review.title && (
                  <div className="font-semibold">{responseModal.review.title}</div>
                )}
                {responseModal.review.comment && (
                  <div className="text-gray-700 mt-2">{responseModal.review.comment}</div>
                )}
              </div>
            </div>
            <textarea
              value={responseModal.message}
              onChange={(e) =>
                setResponseModal((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Enter your response to this review..."
              rows={6}
              maxLength={5000}
              className="w-full border rounded p-3 mb-4"
            />
            <div className="text-sm text-gray-500 mb-4">
              {responseModal.message.length} / 5000 characters
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setResponseModal({ open: false, review: null, message: '' })
                }
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={submitting || !responseModal.message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerReviews;

