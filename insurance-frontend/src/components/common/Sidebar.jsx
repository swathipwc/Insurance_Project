import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, ClipboardList, Plus, Users, Shield, History } from 'lucide-react';

// Icon mapping for menu items
const getIcon = (label) => {
  const iconMap = {
    'Dashboard': LayoutDashboard,
    'My Policies': FileText,
    'My Claims': ClipboardList,
    'Raise Claim': Plus,
    'Customers': Users,
    'Policies': FileText,
    'Claims Review': Shield,
    'Activity Log': History
  };
  return iconMap[label] || LayoutDashboard;
};

const Sidebar = ({ menuItems = [], isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <aside className={`${isOpen ? 'w-64' : 'w-20'} fixed left-0 top-16 h-[calc(100vh-4rem)] bg-purple-900 text-white flex-shrink-0 flex flex-col transition-all duration-300 z-40 overflow-hidden`}>
        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 transition-all duration-300 overflow-y-auto overflow-x-hidden">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && isOpen && (
                <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider px-4 py-2 mb-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = getIcon(item.label);
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={!isOpen ? item.label : ''}
                    className={`flex items-center rounded-lg transition-colors relative group py-2.5 px-3 ${
                      isActive
                        ? "bg-purple-700 text-white"
                        : "text-purple-200 hover:bg-purple-800 hover:text-white"
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onToggle();
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {isOpen && (
                      <span className="ml-3 font-medium text-xs whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Toggle Button - Positioned on the border line */}
      <button
        onClick={onToggle}
        className={`fixed top-[calc(50%+2rem)] -translate-y-1/2 z-50 w-8 h-8 bg-purple-900 border-2 border-purple-700 rounded-full flex items-center justify-center text-white hover:bg-purple-800 transition-all duration-300 shadow-lg ${
          isOpen ? 'left-64 -translate-x-1/2' : 'left-20 -translate-x-1/2'
        }`}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
