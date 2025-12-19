import React from 'react';
import { Eye, Edit } from 'lucide-react';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ClaimList = ({ claims = [], onView, onUpdate, showPolicy = false }) => {
  const columns = [
    { key: 'claimNumber', label: 'Claim ID' },
    showPolicy && { key: 'policyNumber', label: 'Policy Number' },
    { key: 'claimDate', label: 'Claim Date', render: (value) => formatDate(value) },
    { 
      key: 'claimAmount', 
      label: 'Amount', 
      render: (value) => formatCurrency(value) 
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'createdAt', label: 'Submitted', render: (value) => formatDate(value) },
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
          {onUpdate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(row.id);
              }}
              className="p-1.5 rounded hover:bg-purple-50 transition-colors"
              title="Update"
            >
              <Edit className="h-3.5 w-3.5 text-purple-600" />
            </button>
          )}
        </div>
      )
    }
  ].filter(Boolean);

  return <Table columns={columns} data={claims} onRowClick={onView} />;
};

export default ClaimList;
