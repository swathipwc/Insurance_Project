import React from 'react';
import Table from '../common/Table';
import { formatDateTime } from '../../utils/formatters';

const ActivityLog = ({ activities = [] }) => {
  const columns = [
    { key: 'actionType', label: 'Action Type' },
    { key: 'username', label: 'User' },
    { key: 'details', label: 'Details' },
    { key: 'createdAt', label: 'Timestamp', render: (value) => formatDateTime(value) }
  ];

  return <Table columns={columns} data={activities} />;
};

export default ActivityLog;

