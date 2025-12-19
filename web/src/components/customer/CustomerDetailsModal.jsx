import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatDate, formatPhone } from '../../utils/formatters';
import { User, Mail, Phone, Calendar, FileText, CheckCircle2, Hash } from 'lucide-react';

const CustomerDetailsModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const details = [
    {
      label: 'Customer Code',
      value: customer.customerCode || 'N/A',
      icon: Hash,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Name',
      value: customer.name || 'N/A',
      icon: User,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Email',
      value: customer.email || 'N/A',
      icon: Mail,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Phone',
      value: formatPhone(customer.phone) || 'N/A',
      icon: Phone,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Address',
      value: customer.address || 'N/A',
      icon: FileText,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Username',
      value: customer.username || 'N/A',
      icon: User,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Details"
      size="lg"
    >
      <div className="space-y-5">
        {/* Customer Information - Grid Layout */}
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

        {/* Additional Information */}
        {(customer.status || customer.createdAt) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.status && (
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Status
                    </p>
                    <div className="text-sm font-bold text-gray-900">
                      <StatusBadge status={customer.status || 'Active'} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {customer.createdAt && (
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-600 p-2.5 rounded-lg flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Created Date
                    </p>
                    <div className="text-sm font-bold text-gray-900">
                      {formatDate(customer.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


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

export default CustomerDetailsModal;

