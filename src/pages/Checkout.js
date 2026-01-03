import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, CreditCard, Truck, User, Phone, MapPin } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const discountedTotal = subtotal; // Show original price as final price
  const originalTotal = subtotal + tax; // What it would have been with tax

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    navigate('/payment', { state: { shippingAddress, subtotal, tax, total: discountedTotal, originalTotal } });
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-ananta-cream">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/cart" className="btn-secondary inline-flex items-center space-x-2 mb-4">
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-serif text-ananta-dark">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Truck className="w-5 h-5 text-ananta-gold" />
                  <h2 className="text-xl font-semibold text-ananta-dark">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ananta-dark mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={shippingAddress.name}
                        onChange={handleChange}
                        className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ananta-dark mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleChange}
                        className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter your 10-digit phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ananta-dark mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleChange}
                        rows={3}
                        className={`input-field pl-10 resize-none ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="Enter your complete address"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ananta-dark mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ananta-dark mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleChange}
                        className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="w-5 h-5 text-ananta-gold" />
                <h2 className="text-xl font-semibold text-ananta-dark">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="max-h-48 overflow-y-auto space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-ananta-dark">{item.productName}</div>
                        <div className="text-gray-600">{item.size} × {item.quantity}</div>
                      </div>
                      <div className="font-medium text-ananta-gold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 line-through">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Tax Deducted</span>
                    <span>-₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-ananta-dark">
                      <span>You Pay</span>
                      <span className="text-ananta-gold">₹{discountedTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-green-600 text-right mt-1">
                      You saved ₹{tax.toFixed(2)} on tax!
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>By placing this order, you agree to our terms and conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
