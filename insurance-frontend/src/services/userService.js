// Mock user service using localStorage (no backend)
import { getStorageData, STORAGE_KEYS } from '../utils/storage';

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllUsers = async () => {
  await delay();
  return getStorageData(STORAGE_KEYS.USERS);
};

export const getUsersByRole = async (role) => {
  await delay();
  const users = getStorageData(STORAGE_KEYS.USERS);
  return users.filter(u => u.role === role);
};

export const getUserById = async (id) => {
  await delay();
  const users = getStorageData(STORAGE_KEYS.USERS);
  return users.find(u => u.id === id) || null;
};

