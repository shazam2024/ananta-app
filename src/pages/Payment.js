import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import dbManager from '../utils/db';
import Navbar from '../components/Navbar';
import { ArrowLeft, CreditCard, Smartphone, Building2, Check } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const { shippingAddress, subtotal, tax, total, originalTotal } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiry') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 3);
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCardDetails = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.replace(/\s/g, '').trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!cardDetails.expiry.trim()) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
      
      if (!cardDetails.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return 'ANT' + Date.now().toString().slice(-8);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }
    
    setProcessing(true);
    
    setTimeout(async () => {
      try {
        const newOrderId = generateOrderId();
        setOrderId(newOrderId);
        
        const order = {
          orderId: newOrderId,
          userEmail: user.email,
          items: cartItems,
          shippingAddress,
          subtotal,
          tax,
          total,
          paymentMethod,
          orderDate: new Date().toISOString(),
          status: 'confirmed'
        };
        
        await dbManager.addOrder(order);
        await clearCart();
        
        setOrderPlaced(true);
      } catch (error) {
        console.error('Error placing order:', error);
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (!shippingAddress || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-ananta-cream">
        <Navbar />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-serif text-ananta-dark mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase</p>
            <p className="text-lg font-semibold text-ananta-gold mb-8">Order ID: {orderId}</p>
            
            <div className="card p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-ananta-dark mb-4">Order Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-ananta-gold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Address:</span>
                  <span className="text-right">
                    {shippingAddress.name}, {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleContinueShopping}
                className="btn-primary w-full"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="btn-secondary w-full"
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ananta-cream">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/checkout')}
            className="btn-secondary inline-flex items-center space-x-2 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Checkout</span>
          </button>
          <h1 className="text-3xl font-serif text-ananta-dark">Payment</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-ananta-dark mb-6">Select Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-ananta-gold transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-3 text-ananta-gold" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-ananta-gold transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Smartphone className="w-5 h-5 mr-3 text-ananta-gold" />
                    <span className="font-medium">UPI</span>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-ananta-gold transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Building2 className="w-5 h-5 mr-3 text-ananta-gold" />
                    <span className="font-medium">Net Banking</span>
                  </label>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ananta-dark mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`input-field ${errors.cardNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ananta-dark mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`input-field ${errors.expiry ? 'border-red-500' : ''}`}
                        />
                        {errors.expiry && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-ananta-dark mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength={3}
                          className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ananta-dark mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={`input-field ${errors.cardholderName ? 'border-red-500' : ''}`}
                      />
                      {errors.cardholderName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'upi' && (
                  <div className="text-center py-8">
                    <Smartphone className="w-12 h-12 text-ananta-gold mx-auto mb-4" />
                    <p className="text-gray-600">UPI payment will be processed on the next screen</p>
                  </div>
                )}
                
                {paymentMethod === 'netbanking' && (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-ananta-gold mx-auto mb-4" />
                    <p className="text-gray-600">Net Banking options will be shown on the next screen</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing Payment...' : `Pay ₹${total.toFixed(2)}`}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-ananta-dark mb-4">Order Summary</h2>
              
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
                      <span className="text-ananta-gold">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-green-600 text-right mt-1">
                      You saved ₹{tax.toFixed(2)} on tax!
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>Shipping Address:</strong></p>
                <p>{shippingAddress.name}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city} - {shippingAddress.pincode}</p>
                <p>{shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
