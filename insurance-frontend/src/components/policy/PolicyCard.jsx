import React from 'react';
import Card from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';

const PolicyCard = ({ policy, onView, onEdit }) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{policy.policyNumber}</h4>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
            {policy.policyType}
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
            {formatCurrency(policy.premiumAmount)}
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
            {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
          </p>
          <span className={`badge badge-${getStatusColor(policy.status)}`}>
            {policy.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          {onView && (
            <button className="btn btn-sm btn-outline" onClick={() => onView(policy.id)}>
              View
            </button>
          )}
          {onEdit && (
            <button className="btn btn-sm btn-primary" onClick={() => onEdit(policy.id)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PolicyCard;

