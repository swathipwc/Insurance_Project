// LocalStorage-based data storage (no backend needed)

const STORAGE_KEYS = {
  USERS: 'insurance_users',
  CUSTOMERS: 'insurance_customers',
  POLICIES: 'insurance_policies',
  CLAIMS: 'insurance_claims',
  CUSTOMER_POLICIES: 'insurance_customer_policies',
  ACTIVITY_LOGS: 'insurance_activity_logs'
};

// Initialize with sample data if empty
const initializeData = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Just ensure keys exist, actual initialization happens in initApp.js
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.POLICIES)) {
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_POLICIES)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER_POLICIES, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
      }
    }
  } catch (e) {
    // Ignore storage errors
    console.warn('Storage initialization error:', e);
  }
};

// Get data from storage
export const getStorageData = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      initializeData();
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
  } catch (e) {
    // Ignore storage errors
    console.warn('Storage access error:', e);
  }
  return [];
};

// Save data to storage
export const setStorageData = (key, data) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    // Ignore storage errors
    console.warn('Storage write error:', e);
  }
};

// Generate ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Add activity log
export const addActivityLog = (action, entityType, entityId, userId) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const logs = getStorageData(STORAGE_KEYS.ACTIVITY_LOGS);
      logs.unshift({
        id: generateId(),
        action,
        entityType,
        entityId,
        userId,
        timestamp: new Date().toISOString()
      });
      setStorageData(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    }
  } catch (e) {
    // Ignore storage errors
    console.warn('Activity log error:', e);
  }
};

export { STORAGE_KEYS };

