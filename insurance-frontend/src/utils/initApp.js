// Initialize app with dummy data on first load
import { STORAGE_KEYS } from './storage';
import { 
  getInitialUsers,
  getInitialCustomers, 
  getInitialPolicies, 
  getInitialCustomerPolicies, 
  getInitialClaims, 
  getInitialActivityLogs 
} from './initialData';

export const initializeAppData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.USERS) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getInitialUsers()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(getInitialCustomers()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.POLICIES) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.POLICIES) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(getInitialPolicies()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CLAIMS) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMS) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(getInitialClaims()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_POLICIES) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_POLICIES) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_POLICIES, JSON.stringify(getInitialCustomerPolicies()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || 
      JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || '[]').length === 0) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(getInitialActivityLogs()));
  }
};

