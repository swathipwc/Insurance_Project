import api from './api';

export const getAllPolicies = async () => {
  const response = await api.get('/admin/policies');
  return response.data;
};

export const getPolicyById = async (id) => {
  const response = await api.get(`/admin/policies/${id}`);
  return response.data;
};

export const createPolicy = async (policyData) => {
  const response = await api.post('/admin/policies', policyData);
  return response.data;
};

export const updatePolicy = async (id, policyData) => {
  const response = await api.put(`/admin/policies/${id}`, policyData);
  return response.data;
};

export const assignPolicyToCustomer = async (customerId, policyId) => {
  const response = await api.post(`/admin/policies/customers/${customerId}/assign`, {
    policyId
  });
  return response.data;
};

// Customer endpoints
export const getMyPolicies = async () => {
  const response = await api.get('/policy/customer/my-policies');
  return response.data;
};
