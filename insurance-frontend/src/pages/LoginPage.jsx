import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data);
      if (res.data.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (res.data.role === 'CUSTOMER') navigate('/customer', { replace: true });
      else navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Insurance Portal</h1>
        <p className="muted">Sign in with your admin or customer account</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="admin or customer username"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-hint">
          <p><strong>Demo Admin:</strong> admin / admin123</p>
          <p><strong>Demo Customer:</strong> create via Admin &gt; Customers</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
