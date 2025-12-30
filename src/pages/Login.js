import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/products');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 sm:mb-12 fade-in">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-ananta-gold to-[#B8941F] rounded-2xl sm:rounded-3xl flex items-center justify-center transform hover:scale-110 transition-all duration-300">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif bg-gradient-to-r from-ananta-dark to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3">Ananta Perfume</h1>
          <p className="text-lg sm:text-xl text-gray-600">Welcome back to luxury</p>
        </div>

        <div className="card p-6 sm:p-8 lg:p-10 scale-in">
          <h2 className="text-2xl sm:text-3xl font-serif text-ananta-dark mb-6 sm:mb-8 text-center">Login</h2>
          
          {errors.general && (
            <div className="error-banner mb-4 sm:mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-ananta-dark mb-2 sm:mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ananta-dark mb-2 sm:mb-3 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pr-12 sm:pr-14 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ananta-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={20} className="sm:w-6 sm:h-6" /> : <Eye size={20} className="sm:w-6 sm:h-6" />}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2 sm:mr-3"></div>
                  Logging in...
                </div>
              ) : (
                'Login to Your Account'
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-base sm:text-lg">
              Don't have an account?{' '}
              <Link to="/signup" className="text-ananta-gold hover:text-yellow-600 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
