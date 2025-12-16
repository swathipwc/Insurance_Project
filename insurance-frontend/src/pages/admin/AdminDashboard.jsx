import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p className="muted">
        Welcome to the Insurance Policy & Claim Management admin console.
      </p>
      <div className="grid">
        <div className="card">
          <h3>Customers</h3>
          <p>Manage customer onboarding and profile details.</p>
        </div>
        <div className="card">
          <h3>Policies</h3>
          <p>Create and manage insurance policies and assign to customers.</p>
        </div>
        <div className="card">
          <h3>Claims</h3>
          <p>Review, approve or reject claims submitted by customers.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
