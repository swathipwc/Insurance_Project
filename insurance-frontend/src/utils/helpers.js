import { CLAIM_STATUS } from './constants';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    'Active': 'success',
    'Expired': 'gray',
    'Cancelled': 'error',
    [CLAIM_STATUS.SUBMITTED]: 'primary',
    [CLAIM_STATUS.IN_REVIEW]: 'warning',
    [CLAIM_STATUS.APPROVED]: 'success',
    [CLAIM_STATUS.REJECTED]: 'error'
  };
  return statusColors[status] || 'gray';
};

export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

export const isCustomer = (user) => {
  return user?.role === 'CUSTOMER';
};

export const isAdmin = (user) => {
  return user?.role === 'ADMIN';
};

