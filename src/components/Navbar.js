import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, Package, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center">
            <Link to="/products" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-ananta-gold to-[#B8941F] rounded-xl sm:rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-ananta-dark to-gray-700 bg-clip-text text-transparent">Ananta</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6 sm:space-x-8">
            <Link
              to="/products"
              className={`navbar-link ${isActivePath('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className={`navbar-link flex items-center space-x-2 relative ${isActivePath('/cart') ? 'active' : ''}`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-ananta-gold text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className={`navbar-link flex items-center space-x-2 ${isActivePath('/orders') ? 'active' : ''}`}
            >
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3 bg-gray-50 px-3 sm:px-4 py-2 rounded-full">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-ananta-gold rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500">Welcome</p>
                <p className="text-sm font-semibold text-ananta-dark">{user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-xs sm:text-sm px-2 sm:px-4 py-2"
              title="Logout"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full mb-4">
              <div className="w-8 h-8 bg-ananta-gold rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Welcome</p>
                <p className="text-sm font-semibold text-ananta-dark">{user.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${isActivePath('/products') ? 'bg-ananta-gold text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Products</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center p-3 rounded-xl relative transition-all ${isActivePath('/cart') ? 'bg-ananta-gold text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold animate-bounce">
                    {getCartCount()}
                  </span>
                )}
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${isActivePath('/orders') ? 'bg-ananta-gold text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Orders</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
