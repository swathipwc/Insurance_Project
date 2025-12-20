export const ROLES = {
  CUSTOMER: 'Customer',
  ADMIN: 'Admin'
};

export const POLICY_TYPES = [
  'Health',
  'Auto',
  'Life',
  'Home',
  'Travel'
];

export const POLICY_STATUS = [
  'Active',
  'Expired',
  'Cancelled'
];

export const CLAIM_STATUS = {
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id) => `/customers/${id}`
  },
  POLICIES: {
    BASE: '/policies',
    BY_ID: (id) => `/policies/${id}`,
    CUSTOMER_POLICIES: (customerId) => `/customers/${customerId}/policies`,
    ASSIGN: (policyId) => `/policies/${policyId}/assign`
  },
  CLAIMS: {
    BASE: '/claims',
    BY_ID: (id) => `/claims/${id}`,
    CUSTOMER_CLAIMS: (customerId) => `/customers/${customerId}/claims`,
    UPDATE_STATUS: (id) => `/claims/${id}/status`
  },
  ACTIVITY: {
    BASE: '/activity-logs'
  }
};

