import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const CustomerLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Insurance Portal</div>
        <nav className="nav-links">
          <NavLink to="/customer" end>Dashboard</NavLink>
          <NavLink to="/customer/claims">My Claims</NavLink>
          <NavLink to="/customer/claims/new">New Claim</NavLink>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div />
          <div className="topbar-right">
            <span className="chip">{user?.username} ({user?.role})</span>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
