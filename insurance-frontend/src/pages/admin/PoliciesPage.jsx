import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const PoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    policyNumber: '',
    policyType: 'HEALTH',
    premiumAmount: 0,
    startDate: '',
    endDate: ''
  });
  const [assignForm, setAssignForm] = useState({
    customerId: '',
    policyId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/policies');
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssignChange = (e) => {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        premiumAmount: Number(form.premiumAmount),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: "ACTIVE"
      };
      await api.post('/api/admin/policies', payload);
      setSuccess('Policy created successfully');
      setForm({
        policyNumber: '',
        policyType: 'HEALTH',
        premiumAmount: 0,
        startDate: '',
        endDate: ''
      });
      fetchPolicies();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message ||
      (typeof err.response?.data === 'string' ? err.response.data : null) ||
      'Failed to create policy');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!assignForm.customerId || !assignForm.policyId) {
      setError('Customer ID and Policy ID are required to assign');
      return;
    }
    try {
      await api.post(`/api/admin/policies/customers/${assignForm.customerId}/assign`, {
        policyId: Number(assignForm.policyId)
      });
      setSuccess('Policy assigned successfully');
      setAssignForm({ customerId: '', policyId: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to assign policy');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Policies</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>New Policy</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Policy Number
              <input name="policyNumber" value={form.policyNumber} onChange={handleChange} required />
            </label>
            <label>
              Policy Type
              <select name="policyType" value={form.policyType} onChange={handleChange}>
                <option value="HEALTH">HEALTH</option>
                <option value="AUTO">AUTO</option>
                <option value="LIFE">LIFE</option>
                <option value="HOME">HOME</option>
              </select>
            </label>
            <label>
              Premium Amount
              <input
                type="number"
                name="premiumAmount"
                value={form.premiumAmount}
                onChange={handleChange}
                min="0"
                required
              />
            </label>
            <label>
              Start Date
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            </label>
            <label>
              End Date
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            </label>
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}
            <button className="btn primary" type="submit">Create Policy</button>
          </form>
        </div>
        <div className="card">
          <h3>Existing Policies</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.policyNumber}</td>
                    <td>{p.policyType}</td>
                    <td>{p.premiumAmount}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <hr className="divider" />
          <h3>Assign Policy to Customer</h3>
          <form className="form inline" onSubmit={handleAssign}>
            <label>
              Customer ID
              <input
                name="customerId"
                value={assignForm.customerId}
                onChange={handleAssignChange}
                required
              />
            </label>
            <label>
              Policy ID
              <input
                name="policyId"
                value={assignForm.policyId}
                onChange={handleAssignChange}
                required
              />
            </label>
            <button className="btn primary" type="submit">Assign</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
