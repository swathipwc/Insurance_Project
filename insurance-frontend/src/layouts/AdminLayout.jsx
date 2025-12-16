import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Insurance Admin</div>
        <nav className="nav-links">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
          <NavLink to="/admin/policies">Policies</NavLink>
          <NavLink to="/admin/claims">Claims</NavLink>
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

export default AdminLayout;
