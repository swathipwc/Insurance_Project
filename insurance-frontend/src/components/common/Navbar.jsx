import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-purple-900 text-white h-16 flex items-center justify-between px-6 flex-shrink-0 z-30 transition-all duration-300">
      {/* Logo and Company Name */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-purple-900 font-bold text-sm">
          I
        </div>
        <span className="text-white font-semibold text-sm">Insurance Management</span>
      </div>
      
      {/* Profile Section */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-left hidden md:block">
            <div className="text-xs font-medium text-white">{user.username}</div>
            <div className="text-[10px] text-purple-200">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:bg-purple-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
