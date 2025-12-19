import api from './api';

export const getAllPolicies = async (page = 0) => {
  const response = await api.get(`/admin/policies?page=${page}`);
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
  try {
    const response = await api.post(`/admin/policies/customers/${customerId}/assign`, {
      policyId
    });
    return response.data;
  } catch (error) {
    // Extract error message from API response
    const errorMessage = error.response?.data?.message || error.message || 'Failed to assign policy';
    throw new Error(errorMessage);
  }
};

// Customer endpoints
export const getMyPolicies = async () => {
  const response = await api.get('/policy/customer/my-policies');
  return response.data;
};
