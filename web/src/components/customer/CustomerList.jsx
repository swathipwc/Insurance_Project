import React from 'react';
import { Eye, Edit } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import { formatDate, formatPhone } from '../../utils/formatters';

const CustomerList = ({ customers = [], onView, onEdit }) => {
  const columns = [
    { key: 'customerCode', label: 'Customer Code' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (value) => formatPhone(value) || '-' },
    { key: 'address', label: 'Address' },
    { key: 'username', label: 'Username' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row.customerCode);
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
        </div>
      )
    }
  ];

  return <Table columns={columns} data={customers} onRowClick={onView ? (row) => onView(row.customerCode) : undefined} />;
};

export default CustomerList;
