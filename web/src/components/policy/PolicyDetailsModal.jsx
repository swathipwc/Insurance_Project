import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { FileText, Calendar, DollarSign, CheckCircle2, XCircle, Hash } from 'lucide-react';

const PolicyDetailsModal = ({ isOpen, onClose, policy }) => {
  if (!policy) return null;

  // Map status from enum to display format
  const getStatusDisplay = (status) => {
    if (!status) return 'Active';
    const statusMap = {
      'ACTIVE': 'Active',
      'INACTIVE': 'Inactive',
      'EXPIRED': 'Expired'
    };
    return statusMap[status] || status;
  };

  const statusDisplay = getStatusDisplay(policy.status);

  const details = [
    {
      label: 'Policy Code',
      value: policy.policyCode || 'N/A',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Policy Number',
      value: policy.policyNumber || 'N/A',
      icon: Hash,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      label: 'Policy Type',
      value: policy.policyType || 'N/A',
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Coverage Amount',
      value: formatCurrency(policy.coverageAmount || 0),
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Start Date',
      value: formatDate(policy.startDate),
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'End Date',
      value: formatDate(policy.endDate),
      icon: Calendar,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Status',
      value: <StatusBadge status={statusDisplay} />,
      icon: statusDisplay === 'Active' ? CheckCircle2 : XCircle,
      iconBg: statusDisplay === 'Active' ? 'bg-green-100' : 'bg-red-100',
      iconColor: statusDisplay === 'Active' ? 'text-green-600' : 'text-red-600'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Policy Details"
      size="lg"
    >
      <div className="space-y-5">
        {/* Policy Information - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`${detail.iconBg} ${detail.iconColor} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {detail.label}
                    </p>
                    <div className="text-sm font-bold text-gray-900">
                      {typeof detail.value === 'string' || typeof detail.value === 'number' ? detail.value : detail.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Policy ID (for reference) */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Hash className="h-4 w-4 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-medium">Policy ID:</span>
            <span className="text-[10px] text-gray-700 font-mono font-semibold">{policy.policyId || policy.id || 'N/A'}</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyDetailsModal;

