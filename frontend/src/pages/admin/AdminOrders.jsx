import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Package, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    if (!user) {
      console.log('❌ No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      console.log('❌ Not admin, redirecting to home');
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    console.log('✅ Admin verified, fetching orders');
    fetchOrders();
  }, [user, loading, navigate, accessToken]);

  const fetchOrders = async () => {
    setDataLoading(true);
    try {
      console.log('📦 Fetching all orders...');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log('✅ Orders fetched:', data.length);
      } else {
        console.error('❌ Failed to fetch orders:', response.status);
        alert('Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Fetch orders error:', error);
      alert('Network error while fetching orders');
    } finally {
      setDataLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, newPaymentStatus = null) => {
    setUpdating(true);
    try {
      const body = { status: newStatus };
      if (newPaymentStatus) body.paymentStatus = newPaymentStatus;

      console.log('🔄 Updating order:', orderId, body);

      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        console.log('✅ Order updated successfully');
        alert('✅ Order status updated successfully!');
        await fetchOrders();
        setSelectedOrder(null);
      } else {
        const error = await response.json();
        console.error('❌ Update failed:', error);
        alert('Failed to update order: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Update order error:', error);
      alert('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
      'processing': 'bg-purple-100 text-purple-800 border-purple-300',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  // Show loading while auth is checking
  if (loading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">
          {loading ? 'Checking authentication...' : 'Loading orders...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
                <p className="text-gray-600">{orders.length} total orders</p>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              disabled={dataLoading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <RefreshCw size={18} className={dataLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'all' && ` (${orders.length})`}
                {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No orders found for this filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b-2">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-bold text-2xl text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Status</p>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors shadow-md"
                  >
                    {selectedOrder?.id === order.id ? '▲ Hide Details' : '▼ View Details'}
                  </button>
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder?.id === order.id && (
                  <div className="p-6 space-y-6 bg-gray-50">
                    {/* Items */}
                    <div>
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">📦 Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-grow">
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="font-bold text-lg text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-bold text-gray-800 mb-3">📍 Shipping Address</h3>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p className="font-medium">📞 {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-bold text-gray-800 mb-3">💳 Payment Information</h3>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Method:</span>
                            <span className="font-semibold text-gray-800">{order.paymentMethod.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Update Status Actions */}
                    <div className="border-t-2 pt-6">
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">🔄 Update Order Status</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            disabled={order.status === status || updating}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                              order.status === status
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                            } disabled:opacity-50`}
                          >
                            {order.status === status ? '✓ Current' : `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`}
                          </button>
                        ))}
                      </div>
                      {order.paymentStatus === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, order.status, 'paid')}
                          disabled={updating}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          💰 Mark Payment as Received
                        </button>
                      )}
                      {updating && (
                        <p className="text-blue-600 mt-2 flex items-center gap-2">
                          <RefreshCw size={16} className="animate-spin" />
                          Updating...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;