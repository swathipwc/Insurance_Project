import React from 'react';
import { Eye, Edit, UserPlus } from 'lucide-react';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PolicyList = ({ policies = [], onView, onEdit, onAssign, showCustomer = false }) => {
  const columns = [
    { key: 'policyCode', label: 'Policy Code' },
    // Policy Number only shown for customers, not for admin
    ...(showCustomer ? [{ key: 'policyNumber', label: 'Policy Number' }] : []),
    { key: 'policyType', label: 'Type' },
    { 
      key: 'coverageAmount', 
      label: 'Coverage Amount', 
      render: (value) => formatCurrency(value) 
    },
    { key: 'startDate', label: 'Start Date', render: (value) => formatDate(value) },
    { key: 'endDate', label: 'End Date', render: (value) => formatDate(value) },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        // Map status for display
        const statusMap = {
          'ACTIVE': 'Active',
          'INACTIVE': 'Inactive',
          'EXPIRED': 'Expired'
        };
        const displayStatus = statusMap[value] || value;
        return <StatusBadge status={displayStatus} />;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row.id);
              }}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="View"
            >
              <Eye className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.id);
              }}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Edit"
            >
              <Edit className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
          {onAssign && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign(row.id);
              }}
              className="p-1.5 rounded hover:bg-purple-50 transition-colors"
              title="Assign"
            >
              <UserPlus className="h-3.5 w-3.5 text-purple-600" />
            </button>
          )}
        </div>
      )
    }
  ];

  return <Table columns={columns} data={policies} onRowClick={onView} />;
};

export default PolicyList;
