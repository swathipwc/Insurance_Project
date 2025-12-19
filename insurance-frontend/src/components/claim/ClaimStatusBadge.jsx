import React from 'react';
import { getStatusColor } from '../../utils/helpers';

const ClaimStatusBadge = ({ status }) => {
  return (
    <span className={`badge badge-${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default ClaimStatusBadge;

