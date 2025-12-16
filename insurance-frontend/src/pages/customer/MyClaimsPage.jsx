import React, { useEffect, useState } from 'react';
import api from '../../api/client';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/claims/me');
      setClaims(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Claims</h2>
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
                <th>Policy ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.policyId}</td>
                  <td>{c.claimDate}</td>
                  <td>{c.claimAmount}</td>
                  <td>{c.status}</td>
                  <td>{c.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyClaimsPage;
