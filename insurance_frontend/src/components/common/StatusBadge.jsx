import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    // Claim statuses
    if (statusLower.includes('approved')) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (statusLower.includes('rejected')) {
      return 'bg-red-100 text-red-700 border-red-300';
    }
    if (statusLower.includes('pending') || statusLower.includes('submitted') || statusLower.includes('review')) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
    
    // Policy statuses
    if (statusLower.includes('active')) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (statusLower.includes('inactive') || statusLower.includes('expired')) {
      return 'bg-red-100 text-red-700 border-red-300';
    }
    if (statusLower.includes('hold')) {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    }
    
    // Default
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

