import React, { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductModal from '../components/ProductModal';
import Navbar from '../components/Navbar';
import { ShoppingBag } from 'lucide-react';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = async (product, size, quantity) => {
    return await addToCart(product, size, quantity);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-16 fade-in">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-ananta-gold to-[#B8941F] rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif bg-gradient-to-r from-ananta-dark to-gray-700 bg-clip-text text-transparent">Ananta Collection</h1>
          </div>
          <p className="text-base sm:text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Discover luxury fragrances crafted with the finest ingredients for the discerning connoisseur
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="product-card card scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="badge">New</div>
              </div>
              
              <div className="product-info">
                <h3 className="product-title text-lg sm:text-xl">{product.name}</h3>
                <p className="product-description text-sm">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">50ml</div>
                    <div className="price-display text-lg sm:text-2xl">₹{product.price50ml}</div>
                  </div>
                  <div className="w-px h-8 sm:h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">100ml</div>
                    <div className="price-display text-lg sm:text-2xl">₹{product.price100ml}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => openModal(product)}
                  className="btn-primary w-full group text-sm sm:text-base"
                >
                  <ShoppingBag size={16} className="mr-2 sm:mr-2 group-hover:animate-bounce" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Products;
