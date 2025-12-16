import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/admin/customers', form);
      setSuccess('Customer created successfully');
      setForm({ name: '', email: '', phone: '', username: '', password: '' });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to create customer');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Customers</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>New Customer</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              Username
              <input name="username" value={form.username} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}
            <button className="btn primary" type="submit">Create Customer</button>
          </form>
        </div>
        <div className="card">
          <h3>Existing Customers</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
