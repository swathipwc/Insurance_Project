import api from './api';

export const createClaim = async (claimData) => {
  const response = await api.post('/claims', claimData);
  return response.data;
};

export const getMyClaims = async () => {
  const response = await api.get('/claims/me');
  return response.data;
};

export const getAllClaims = async (filters = {}, page = 0) => {
  const params = new URLSearchParams();
  params.append('page', page);
  if (filters.status) params.append('status', filters.status);
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  
  const response = await api.get(`/admin/claims?${params.toString()}`);
  return response.data;
};

export const updateClaimStatus = async (claimId, status, remarks) => {
  const response = await api.put(`/admin/claims/${claimId}/status`, {
    status,
    remarks
  });
  return response.data;
};
