import api from './api';

export const getAllCustomers = async () => {
  try {
    const response = await api.get('/admin/customers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customers');
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customer');
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/admin/customers', customerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create customer');
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/admin/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update customer');
  }
};

export const deleteCustomer = async (id) => {
  try {
    await api.delete(`/admin/customers/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete customer');
  }
};
