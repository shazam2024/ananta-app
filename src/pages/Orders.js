import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dbManager from '../utils/db';
import Navbar from '../components/Navbar';
import { Package, Calendar, ChevronDown, ChevronUp, IndianRupee, MapPin, Phone } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await dbManager.getOrders(user.email);
        setOrders(userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-emerald-600 bg-emerald-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ananta-cream">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ananta-gold mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ananta-cream">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif text-ananta-dark mb-8">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-serif text-ananta-dark mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a
              href="/products"
              className="btn-primary inline-block"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-ananta-dark">
                          Order #{order.orderId}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.orderDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-semibold text-ananta-gold">{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleOrderExpansion(order.orderId)}
                      className="flex items-center space-x-2 text-ananta-gold hover:text-yellow-600 transition-colors mt-4 sm:mt-0"
                    >
                      <span className="font-medium">
                        {expandedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                      </span>
                      {expandedOrder === order.orderId ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                  
                  {expandedOrder === order.orderId && (
                    <div className="border-t pt-6 space-y-6">
                      <div>
                        <h4 className="font-semibold text-ananta-dark mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                  <div className="font-medium text-ananta-dark">{item.productName}</div>
                                  <div className="text-sm text-gray-600">{item.size} × {item.quantity}</div>
                                </div>
                              </div>
                              <div className="text-ananta-gold font-semibold">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-ananta-dark mb-3">Shipping Address</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-ananta-dark">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{order.shippingAddress.phone}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-ananta-dark mb-3">Payment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tax (10%)</span>
                              <span>₹{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold text-ananta-dark">
                              <span>Total</span>
                              <span className="text-ananta-gold">₹{order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 pt-2">
                              <span>Payment Method</span>
                              <span className="capitalize">{order.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
