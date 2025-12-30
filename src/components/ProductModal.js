import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const result = await onAddToCart(product, selectedSize, quantity);
      if (result.success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const price = selectedSize === '50ml' ? product.price50ml : product.price100ml;
  const totalPrice = price * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-ananta-dark mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">{product.description}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-12 lg:w-12 lg:h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:rotate-90 flex-shrink-0"
            >
              <X size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
            </button>
          </div>

          <div className="mb-6 sm:mb-8">
            <div className="aspect-video sm:aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h4 className="text-lg sm:text-xl font-semibold text-ananta-dark mb-3 sm:mb-4">Select Size</h4>
            <div className="size-selector grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setSelectedSize('50ml')}
                className={`size-option ${selectedSize === '50ml' ? 'selected' : ''} p-3 sm:p-5`}
              >
                <div className="size-name text-sm sm:text-base">50ml</div>
                <div className="size-price text-base sm:text-lg lg:text-xl">₹{product.price50ml}</div>
              </button>
              <button
                onClick={() => setSelectedSize('100ml')}
                className={`size-option ${selectedSize === '100ml' ? 'selected' : ''} p-3 sm:p-5`}
              >
                <div className="size-name text-sm sm:text-base">100ml</div>
                <div className="size-price text-base sm:text-lg lg:text-xl">₹{product.price100ml}</div>
              </button>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h4 className="text-lg sm:text-xl font-semibold text-ananta-dark mb-3 sm:mb-4">Quantity</h4>
            <div className="quantity-selector">
              <button
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="quantity-btn w-8 h-8 sm:w-11 sm:h-11"
              >
                <Minus size={16} className="sm:w-5 sm:h-5" />
              </button>
              <div className="quantity-display text-base sm:text-lg min-w-8 sm:min-w-10">{quantity}</div>
              <button
                onClick={increaseQuantity}
                disabled={quantity === 10}
                className="quantity-btn w-8 h-8 sm:w-11 sm:h-11"
              >
                <Plus size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Total Price</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-ananta-gold">₹{totalPrice}</div>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-500">{selectedSize} × {quantity}</div>
                <div className="text-sm sm:text-base lg:text-lg font-semibold">₹{price} each</div>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="btn-primary w-full text-sm sm:text-base lg:text-lg py-3 sm:py-4"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2 sm:mr-3"></div>
                  Adding to Cart...
                </div>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
