import api from './api';

export const getActivityLogs = async (page = 0) => {
  const response = await api.get(`/admin/activity-logs?page=${page}`);
  return response.data;
};

export const createActivityLog = async (activityData) => {
  const response = await api.post('/admin/activity-logs', activityData);
  return response.data;
};

export const getActivityLogsByType = async (type) => {
  const logs = await getActivityLogs();
  return logs.filter(log => log.actionType === type);
};
