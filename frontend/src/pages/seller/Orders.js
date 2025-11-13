import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    searchBy: 'buyerUsername',
    searchValue: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortBy, setSortBy] = useState('purchaseDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState({
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
  });
  const [showShippingLabel, setShowShippingLabel] = useState(false);
  const [generatedLabel, setGeneratedLabel] = useState(null);

  const carrierOptions = [
    { value: 'USPS', label: 'USPS', days: 3 },
    { value: 'FedEx', label: 'FedEx', days: 2 },
    { value: 'UPS', label: 'UPS', days: 2 },
    { value: 'DHL', label: 'DHL Express', days: 1 },
    { value: 'Giao Hang Nhanh', label: 'Giao Hang Nhanh (GHN)', days: 3 },
    { value: 'Vietnam Post', label: 'Vietnam Post', days: 5 },
    { value: 'Viettel Post', label: 'Viettel Post', days: 3 },
    { value: 'J&T Express', label: 'J&T Express', days: 4 },
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'awaiting_payment', label: 'Awaiting payment' },
    { value: 'awaiting_shipment', label: 'Awaiting shipment' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'returned', label: 'Returned' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delivery_failed', label: 'Delivery failed' },
  ];

  const searchByOptions = [
    { value: 'buyerUsername', label: 'Buyer username' },
    { value: 'buyerName', label: 'Buyer name' },
    { value: 'orderNumber', label: 'Order number' },
  ];

  const periodOptions = [
    { value: 'all', label: 'All time' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
  ];

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      };

      if (filters.status !== 'all') {
        params.status = filters.status;
      }

      if (filters.searchValue.trim()) {
        params.search = filters.searchValue.trim();
      }

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }

      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await api.get('/seller/orders', { params });
      setOrders(response.data.orders);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePeriodChange = (period) => {
    const now = new Date();
    let startDate = '';
    let endDate = '';

    if (period !== 'all' && period !== 'custom') {
      const daysAgo = parseInt(period);
      startDate = format(new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      endDate = format(now, 'yyyy-MM-dd');
    }

    setFilters({ ...filters, startDate, endDate });
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      searchBy: 'buyerUsername',
      searchValue: '',
      startDate: '',
      endDate: '',
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id));
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      awaiting_payment: 'bg-yellow-100 text-yellow-800',
      awaiting_shipment: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-orange-100 text-orange-800',
      refunded: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      delivery_failed: 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const generateTrackingNumber = (carrier) => {
    const prefixes = {
      'USPS': '9400',
      'FedEx': '7789',
      'UPS': '1Z',
      'DHL': 'JD',
      'Giao Hang Nhanh': 'GHN',
      'Vietnam Post': 'VNP',
      'Viettel Post': 'VTP',
      'J&T Express': 'JT',
    };
    const prefix = prefixes[carrier] || 'TRK';
    const randomNum = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return `${prefix}${randomNum}`;
  };

  const calculateEstimatedDelivery = (carrier) => {
    const carrierInfo = carrierOptions.find(c => c.value === carrier);
    const days = carrierInfo?.days || 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toISOString().split('T')[0];
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handlePurchaseShippingLabel = (order) => {
    setCurrentOrder(order);
    setShowShippingModal(true);
  };

  const handleCarrierChange = (carrier) => {
    const trackingNumber = generateTrackingNumber(carrier);
    const estimatedDelivery = calculateEstimatedDelivery(carrier);
    setTrackingInfo({
      carrier,
      trackingNumber,
      estimatedDelivery,
    });
  };

  const handleSubmitTracking = async () => {
    try {
      await api.post(`/seller/orders/${currentOrder._id}/tracking`, trackingInfo);
      
      // Generate shipping label
      const label = {
        orderNumber: currentOrder.orderNumber,
        trackingNumber: trackingInfo.trackingNumber,
        carrier: trackingInfo.carrier,
        estimatedDelivery: trackingInfo.estimatedDelivery,
        buyerName: currentOrder.buyerName,
        buyerAddress: currentOrder.shippingAddress,
        listingTitle: currentOrder.listingTitle,
        purchaseDate: currentOrder.purchaseDate,
      };
      
      setGeneratedLabel(label);
      setShowShippingModal(false);
      setShowShippingLabel(true);
      fetchOrders();
    } catch (error) {
      console.error('Error adding tracking:', error);
      alert('Failed to add tracking information');
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  const handleCloseLabel = () => {
    setShowShippingLabel(false);
    setGeneratedLabel(null);
    setTrackingInfo({ carrier: '', trackingNumber: '', estimatedDelivery: '' });
  };

  const handleMarkAsShipped = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to mark as shipped');
      return;
    }

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          api.put(`/seller/orders/${orderId}/status`, { status: 'shipped' })
        )
      );
      alert(`${selectedOrders.length} order(s) marked as shipped!`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error marking orders as shipped:', error);
      alert('Failed to mark orders as shipped');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = async () => {
    try {
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.searchValue.trim(),
      };

      // Create CSV content
      let csv = 'Order Number,Buyer Name,Buyer Username,Status,Quantity,Item Price,Total,Purchase Date,Payment Date\n';
      
      orders.forEach((order) => {
        csv += `"${order.orderNumber}","${order.buyerName}","${order.buyerUsername}","${formatStatus(order.status)}",${order.pricing.quantity},${order.pricing.itemPrice},${order.pricing.total},"${format(new Date(order.purchaseDate), 'yyyy-MM-dd HH:mm')}","${order.paymentDate ? format(new Date(order.paymentDate), 'yyyy-MM-dd HH:mm') : 'N/A'}"\n`;
      });

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage your orders and shipments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by
              </label>
              <select
                value={filters.searchBy}
                onChange={(e) => handleFilterChange('searchBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {searchByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.searchValue}
                  onChange={(e) => handleFilterChange('searchValue', e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Range (if selected) */}
          {filters.startDate || filters.endDate ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Results: <span className="font-semibold">{pagination.total}</span> orders
              {filters.status !== 'all' && ` (${formatStatus(filters.status)})`}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Print
              </button>
              <button 
                onClick={handleDownloadReport}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Download report
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkAsShipped}
              disabled={selectedOrders.length === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Shipped
            </button>
            <button
              disabled={selectedOrders.length === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Print coupon
            </button>
            <button
              disabled={selectedOrders.length === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Relist
            </button>
            <button
              disabled={selectedOrders.length === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Leave feedback
            </button>
            <button
              disabled={selectedOrders.length === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              More
            </button>
            <div className="ml-auto">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select 
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="purchaseDate-desc">Date (Newest)</option>
                <option value="purchaseDate-asc">Date (Oldest)</option>
                <option value="total-desc">Amount (High to Low)</option>
                <option value="total-asc">Amount (Low to High)</option>
                <option value="orderNumber-asc">Order Number</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sold for
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date buyer paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ZIP code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engage buyer
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {(order.status === 'awaiting_shipment' || order.status === 'awaiting_payment') && (
                            <div className="text-xs text-red-600 font-medium">
                              Shipping overdue
                              <div className="text-gray-600">
                                Ship by {format(new Date(order.purchaseDate), 'MMM dd')}
                              </div>
                            </div>
                          )}
                          {!order.tracking?.trackingNumber && 
                           (order.status === 'awaiting_shipment' || order.status === 'awaiting_payment') && (
                            <button 
                              onClick={() => handlePurchaseShippingLabel(order)}
                              className="text-xs text-blue-600 hover:underline text-left"
                            >
                              Purchase shipping label
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <img
                            src={order.listingImage || 'https://via.placeholder.com/50'}
                            alt={order.listingTitle}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <a
                              href={`/seller/orders/${order._id}`}
                              className="text-sm text-blue-600 hover:underline font-medium block mb-1"
                            >
                              {order.orderNumber}
                            </a>
                            <div className="text-sm text-gray-900 mb-1">
                              {order.buyerName}{' '}
                              <a
                                href={`/buyer/${order.buyerUsername}`}
                                className="text-blue-600 hover:underline"
                              >
                                {order.buyerUsername}
                              </a>{' '}
                              ({order.pricing.quantity})
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {order.listingTitle}
                            </div>
                            {order.customSku && (
                              <div className="text-xs text-gray-500">
                                Custom label (SKU): {order.customSku}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Sold via promoted listings
                            </div>
                            {order.tracking?.trackingNumber && (
                              <button className="text-xs text-blue-600 hover:underline mt-1">
                                + Add tracking
                              </button>
                            )}
                            <div className="mt-2">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(
                                  order.status
                                )}`}
                              >
                                {formatStatus(order.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.pricing.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(order.pricing.itemPrice, order.pricing.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.pricing.total, order.pricing.currency)}
                        </div>
                        <button className="text-xs text-blue-600 hover:underline">
                          ⓘ
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {format(new Date(order.purchaseDate), 'MMM dd, yyyy')}
                        <div className="text-xs text-gray-500">
                          at {format(new Date(order.purchaseDate), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.paymentDate
                          ? format(new Date(order.paymentDate), 'MMM dd')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.shippingAddress?.postalCode || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm text-blue-600 hover:underline">
                          Send coupon
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Label Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Purchase Shipping Label</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={currentOrder?.orderNumber || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Carrier <span className="text-red-500">*</span>
                </label>
                <select
                  value={trackingInfo.carrier}
                  onChange={(e) => handleCarrierChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select shipping carrier</option>
                  {carrierOptions.map((carrier) => (
                    <option key={carrier.value} value={carrier.value}>
                      {carrier.label} - Estimated delivery: {carrier.days} day{carrier.days > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {trackingInfo.carrier && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Generated Tracking Number:</p>
                    <p className="text-lg font-mono font-bold text-blue-600">{trackingInfo.trackingNumber}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Estimated Delivery:</p>
                    <p className="text-lg font-semibold text-green-600">
                      {format(new Date(trackingInfo.estimatedDelivery), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitTracking}
                disabled={!trackingInfo.carrier}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Generate Label & Ship
              </button>
              <button
                onClick={() => {
                  setShowShippingModal(false);
                  setTrackingInfo({ carrier: '', trackingNumber: '', estimatedDelivery: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Label Display */}
      {showShippingLabel && generatedLabel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b no-print">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Shipping Label</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrintLabel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Print Label
                  </button>
                  <button
                    onClick={handleCloseLabel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Label Content */}
            <div className="p-8 print:p-0" id="shipping-label">
              <div className="border-4 border-black p-6 max-w-lg mx-auto bg-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded">
                      <span className="text-white font-bold text-xl">📦</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">UNITED STATES</div>
                      <div className="text-sm font-medium">POSTAL SERVICE</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Preferred shipping service on</div>
                    <div className="text-2xl font-bold">eBay</div>
                  </div>
                </div>

                {/* Priority Badge */}
                <div className="bg-red-600 text-white text-center py-3 mb-6">
                  <div className="text-3xl font-bold">
                    {generatedLabel.carrier === 'USPS' ? 'USPS PRIORITY MAIL®' : 
                     generatedLabel.carrier === 'FedEx' ? 'FEDEX EXPRESS' :
                     generatedLabel.carrier === 'UPS' ? 'UPS GROUND' :
                     generatedLabel.carrier.toUpperCase() + ' EXPRESS'}
                  </div>
                </div>

                {/* Ship To */}
                <div className="mb-6">
                  <div className="text-sm font-semibold mb-2">SHIP TO:</div>
                  <div className="text-lg font-bold">{generatedLabel.buyerName}</div>
                  <div className="text-base">
                    {generatedLabel.buyerAddress.street}
                  </div>
                  {generatedLabel.buyerAddress.ward && (
                    <div className="text-base">{generatedLabel.buyerAddress.ward}</div>
                  )}
                  {generatedLabel.buyerAddress.district && (
                    <div className="text-base">{generatedLabel.buyerAddress.district}</div>
                  )}
                  <div className="text-base">
                    {generatedLabel.buyerAddress.city}, {generatedLabel.buyerAddress.postalCode}
                  </div>
                  <div className="text-base font-semibold">
                    {generatedLabel.buyerAddress.country}
                  </div>
                </div>

                {/* Tracking Barcode */}
                <div className="border-2 border-black p-4 mb-4">
                  <div className="text-center mb-2">
                    <div className="text-xs font-semibold">ZIP - e/ {generatedLabel.carrier} DELIVERY CONFIRMATION</div>
                  </div>
                  <div className="flex flex-col items-center">
                    {/* Simulated Barcode */}
                    <div className="font-mono text-xs mb-2">
                      ||||||||||||||||||||||||||||||||||||||||||||||||
                    </div>
                    <div className="font-mono text-sm font-bold tracking-widest">
                      {generatedLabel.trackingNumber}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-100 p-3 mb-4 text-sm">
                  <div className="font-semibold mb-1">Order Details:</div>
                  <div>Order #: {generatedLabel.orderNumber}</div>
                  <div>Item: {generatedLabel.listingTitle}</div>
                  <div>Ship Date: {format(new Date(), 'MMM dd, yyyy')}</div>
                  <div>Estimated Delivery: {format(new Date(generatedLabel.estimatedDelivery), 'MMM dd, yyyy')}</div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black pt-3 text-center">
                  <div className="text-xs">
                    Electronic Rate Approved #{Math.floor(Math.random() * 1000000000)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs">The safer, easier way to pay</span>
                    <span className="font-bold text-lg">PayPal</span>
                  </div>
                </div>
              </div>

              {/* Duplicate Label */}
              <div className="mt-8 border-4 border-black p-6 max-w-lg mx-auto bg-white print:mt-4 print:page-break-before-always">
                {/* Same content as above for duplicate */}
                <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded">
                      <span className="text-white font-bold text-xl">📦</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">UNITED STATES</div>
                      <div className="text-sm font-medium">POSTAL SERVICE</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Preferred shipping service on</div>
                    <div className="text-2xl font-bold">eBay</div>
                  </div>
                </div>

                <div className="bg-red-600 text-white text-center py-3 mb-6">
                  <div className="text-3xl font-bold">
                    {generatedLabel.carrier === 'USPS' ? 'USPS PRIORITY MAIL®' : 
                     generatedLabel.carrier === 'FedEx' ? 'FEDEX EXPRESS' :
                     generatedLabel.carrier === 'UPS' ? 'UPS GROUND' :
                     generatedLabel.carrier.toUpperCase() + ' EXPRESS'}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm font-semibold mb-2">SHIP TO:</div>
                  <div className="text-lg font-bold">{generatedLabel.buyerName}</div>
                  <div className="text-base">{generatedLabel.buyerAddress.street}</div>
                  {generatedLabel.buyerAddress.ward && (
                    <div className="text-base">{generatedLabel.buyerAddress.ward}</div>
                  )}
                  {generatedLabel.buyerAddress.district && (
                    <div className="text-base">{generatedLabel.buyerAddress.district}</div>
                  )}
                  <div className="text-base">
                    {generatedLabel.buyerAddress.city}, {generatedLabel.buyerAddress.postalCode}
                  </div>
                  <div className="text-base font-semibold">{generatedLabel.buyerAddress.country}</div>
                </div>

                <div className="border-2 border-black p-4 mb-4">
                  <div className="text-center mb-2">
                    <div className="text-xs font-semibold">ZIP - e/ {generatedLabel.carrier} DELIVERY CONFIRMATION</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-mono text-xs mb-2">
                      ||||||||||||||||||||||||||||||||||||||||||||||||
                    </div>
                    <div className="font-mono text-sm font-bold tracking-widest">
                      {generatedLabel.trackingNumber}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 mb-4 text-sm">
                  <div className="font-semibold mb-1">Order Details:</div>
                  <div>Order #: {generatedLabel.orderNumber}</div>
                  <div>Item: {generatedLabel.listingTitle}</div>
                  <div>Ship Date: {format(new Date(), 'MMM dd, yyyy')}</div>
                  <div>Estimated Delivery: {format(new Date(generatedLabel.estimatedDelivery), 'MMM dd, yyyy')}</div>
                </div>

                <div className="border-t-2 border-black pt-3 text-center">
                  <div className="text-xs">
                    Electronic Rate Approved #{Math.floor(Math.random() * 1000000000)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs">The safer, easier way to pay</span>
                    <span className="font-bold text-lg">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #shipping-label,
          #shipping-label * {
            visibility: visible;
          }
          #shipping-label {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
