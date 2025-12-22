import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import { Shield } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedUsername && savedPassword) {
      setFormData({
        username: savedUsername,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    
    // If unchecked, clear saved credentials
    if (!e.target.checked) {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      
      // Save credentials to localStorage if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        // Clear saved credentials if Remember Me is unchecked
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
      }
      
      // Navigate based on role from JWT token
      if (result.user.role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 w-full relative">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600"></div>
      
      <div className="relative">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-center mb-1 text-gray-900">
          Insurance and Claim Management
        </h2>
        <p className="text-[10px] text-gray-600 text-center mb-4 font-medium">
          Sign in to your account
        </p>
      
        {error && (
          <div className="mb-3">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="w-full h-8 px-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full h-8 px-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label htmlFor="rememberMe" className="ml-2 text-[10px] text-gray-700 font-medium cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-8 mt-4 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

