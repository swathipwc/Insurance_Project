import React, { useState } from 'react';
import api from '../../api/client';

const NewClaimPage = () => {
  const [form, setForm] = useState({
    policyId: '',
    claimAmount: '',
    claimDate: '',
    description: '',
    evidenceUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        policyId: Number(form.policyId),
        claimAmount: Number(form.claimAmount) || 0
      };
      await api.post('/api/claims', payload);
      setSuccess('Claim submitted successfully');
      setForm({
        policyId: '',
        claimAmount: '',
        claimDate: '',
        description: '',
        evidenceUrl: ''
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>New Claim</h2>
      </div>
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Policy ID
            <input
              name="policyId"
              value={form.policyId}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Claim Amount
            <input
              type="number"
              name="claimAmount"
              value={form.claimAmount}
              onChange={handleChange}
              min="0"
              required
            />
          </label>
          <label>
            Claim Date
            <input
              type="date"
              name="claimDate"
              value={form.claimDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </label>
          <label>
            Evidence URL
            <input
              name="evidenceUrl"
              value={form.evidenceUrl}
              onChange={handleChange}
              placeholder="Link to documents, reports, etc."
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewClaimPage;
