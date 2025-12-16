import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/claims');
      setClaims(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (id, status) => {
    const remarks = status === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin';
    setUpdatingId(id);
    setError('');
    try {
      await api.put(`/api/admin/claims/${id}/status`, { status, remarks });
      fetchClaims();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to update claim status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Claims</h2>
      </div>
      <div className="card">
        {error && <div className="alert error">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Policy ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.customerId}</td>
                  <td>{c.policyId}</td>
                  <td>{c.claimDate}</td>
                  <td>{c.claimAmount}</td>
                  <td>{c.status}</td>
                  <td>
                    <button
                      className="btn small success"
                      disabled={updatingId === c.id}
                      onClick={() => updateStatus(c.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn small danger"
                      disabled={updatingId === c.id}
                      onClick={() => updateStatus(c.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClaimsPage;
