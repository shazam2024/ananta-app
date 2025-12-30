import React, { createContext, useContext, useState, useEffect } from 'react';
import dbManager from '../utils/db';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      const items = await dbManager.getCartItems(user.email);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, size, quantity) => {
    if (!user) return { success: false, error: 'Please login to add items to cart' };

    try {
      const cartItem = {
        userEmail: user.email,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        size,
        quantity,
        price: size === '50ml' ? product.price50ml : product.price100ml,
        addedAt: new Date().toISOString()
      };

      const itemId = await dbManager.addToCart(cartItem);
      cartItem.id = itemId;
      setCartItems(prev => [...prev, cartItem]);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      await dbManager.updateCartItem(itemId, { quantity: newQuantity });
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await dbManager.removeCartItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      await dbManager.clearCart(user.email);
      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    loadCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
