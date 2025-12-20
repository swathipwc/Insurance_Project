import React from 'react';
import Card from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';

const ClaimCard = ({ claim, onView, onUpdate }) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
            <h4 style={{ margin: 0 }}>Claim #{claim.id}</h4>
            <span className={`badge badge-${getStatusColor(claim.status)}`}>
              {claim.status}
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
            Date: {formatDate(claim.claimDate)}
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
            {formatCurrency(claim.claimAmount)}
          </p>
          {claim.description && (
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
              {claim.description.substring(0, 100)}...
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          {onView && (
            <button className="btn btn-sm btn-outline" onClick={() => onView(claim.id)}>
              View
            </button>
          )}
          {onUpdate && (
            <button className="btn btn-sm btn-primary" onClick={() => onUpdate(claim.id)}>
              Update
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ClaimCard;

