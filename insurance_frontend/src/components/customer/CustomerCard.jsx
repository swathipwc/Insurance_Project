import React from 'react';
import Card from '../common/Card';
import { formatPhone } from '../../utils/formatters';

const CustomerCard = ({ customer, onView, onEdit }) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{customer.name}</h4>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
            {customer.email}
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            {formatPhone(customer.phone)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          {onView && (
            <button className="btn btn-sm btn-outline" onClick={() => onView(customer.id)}>
              View
            </button>
          )}
          {onEdit && (
            <button className="btn btn-sm btn-primary" onClick={() => onEdit(customer.id)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CustomerCard;

