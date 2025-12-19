export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateDate = (date) => {
  return date && !isNaN(new Date(date).getTime());
};

export const validatePolicyNumber = (policyNumber) => {
  return policyNumber && policyNumber.trim().length >= 5;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (value && rule.email && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }
    
    if (value && rule.phone && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }
    
    if (value && rule.amount && !validateAmount(value)) {
      errors[field] = 'Invalid amount';
      return;
    }
    
    if (value && rule.date && !validateDate(value)) {
      errors[field] = 'Invalid date';
      return;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `Minimum length is ${rule.minLength} characters`;
      return;
    }
  });
  
  return errors;
};

