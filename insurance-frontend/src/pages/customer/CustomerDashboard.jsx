import React from 'react';

const CustomerDashboard = () => {
  return (
    <div>
      <h2>My Dashboard</h2>
      <p className="muted">
        Welcome to your insurance customer portal. You can submit and track claims here.
      </p>
      <div className="grid">
        <div className="card">
          <h3>My Claims</h3>
          <p>View the list and status of claims you have submitted.</p>
        </div>
        <div className="card">
          <h3>New Claim</h3>
          <p>Submit a new claim against one of your active policies.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
