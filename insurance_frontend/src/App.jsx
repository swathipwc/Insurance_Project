import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyPolicies from './pages/customer/MyPolicies';
import MyClaims from './pages/customer/MyClaims';
import RaiseClaim from './pages/customer/RaiseClaim';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomersManagement from './pages/admin/CustomersManagement';
import PoliciesManagement from './pages/admin/PoliciesManagement';
import ClaimsReview from './pages/admin/ClaimsReview';
import ActivityLog from './pages/admin/ActivityLog';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Styles
import './styles/index.css';

const CustomerLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const menuItems = [
    {
      items: [
        { path: '/customer/dashboard', label: 'Dashboard' },
        { path: '/customer/policies', label: 'My Policies' },
        { path: '/customer/claims', label: 'My Claims' },
        { path: '/customer/claims/new', label: 'Raise Claim' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navbar />
      <Sidebar 
        menuItems={menuItems} 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`bg-gray-100 transition-all duration-300 min-h-screen pt-16 overflow-x-hidden ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <div className="p-6 w-full max-w-full box-border">
          {children}
        </div>
      </main>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const menuItems = [
    {
      title: 'Management',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/customers', label: 'Customers' },
        { path: '/admin/policies', label: 'Policies' },
        { path: '/admin/claims', label: 'Claims Review' },
        { path: '/admin/activity', label: 'Activity Log' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden w-full">
      <Navbar />
      <Sidebar 
        menuItems={menuItems} 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`bg-gray-100 transition-all duration-300 min-h-screen pt-16 overflow-x-hidden ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <div className="p-6 w-full max-w-full box-border">
          {children}
        </div>
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated() ? (
          <Navigate to={user?.role === 'CUSTOMER' ? '/customer/dashboard' : '/admin/dashboard'} replace />
        ) : (
          <Login />
        )
      } />

      <Route path="/customer/*" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <CustomerLayout>
            <Routes>
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="policies" element={<MyPolicies />} />
              <Route path="claims" element={<MyClaims />} />
              <Route path="claims/new" element={<RaiseClaim />} />
              <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
            </Routes>
          </CustomerLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<CustomersManagement />} />
              <Route path="policies" element={<PoliciesManagement />} />
              <Route path="claims" element={<ClaimsReview />} />
              <Route path="activity" element={<ActivityLog />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/" element={
        isAuthenticated() ? (
          <Navigate to={user?.role === 'CUSTOMER' ? '/customer/dashboard' : '/admin/dashboard'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

