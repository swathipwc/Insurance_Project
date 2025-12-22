export const validateEmail = (email) => {
 const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return re.test(email);
};
export const validatePhone = (phone) => {
 if (!phone || phone.trim() === "") {
   return false;
 }
 // Allow digits, spaces, dashes, plus signs, and parentheses
 const re = /^[\d\s\-\+\(\)]+$/;
 if (!re.test(phone)) {
   return false;
 }
 // Extract only digits and check for exactly 10 digits
 const digitsOnly = phone.replace(/\D/g, "");
 return digitsOnly.length === 10;
};
export const hasInvalidPhoneCharacters = (phone) => {
 if (!phone) {
   return false;
 }
 // Check if phone contains alphabets or invalid special characters
 // Allowed: digits, spaces, dashes, plus signs, parentheses
 // Invalid: alphabets and other special characters
 const invalidChars = /[^0-9\s\-\+\(\)]/;
 return invalidChars.test(phone);
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
 return (
   value !== null && value !== undefined && value.toString().trim() !== ""
 );
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
     errors[field] = "Invalid email address";
     return;
   }
   if (value && rule.phone) {
     // First check for invalid characters
     if (hasInvalidPhoneCharacters(value)) {
       errors[field] =
         "Phone number can only contain numbers and formatting characters (spaces, dashes, parentheses, plus sign)";
       return;
     }
     // Then check phone format
     if (!validatePhone(value)) {
       const digitsOnly = value.replace(/\D/g, "");
       if (digitsOnly.length === 0) {
         errors[field] = "Phone number is required";
       } else if (digitsOnly.length < 10) {
         errors[
           field
         ] = `Phone number must contain exactly 10 digits (currently ${digitsOnly.length})`;
       } else if (digitsOnly.length > 10) {
         errors[
           field
         ] = `Phone number must contain exactly 10 digits (currently ${digitsOnly.length})`;
       } else {
         errors[field] = "Phone number must contain exactly 10 digits";
       }
       return;
     }
   }
   // Also validate phone if it's required but empty
   if (rule.required && rule.phone && !value) {
     errors[field] = "Phone number is required";
     return;
   }
   if (value && rule.amount && !validateAmount(value)) {
     errors[field] = "Invalid amount";
     return;
   }
   if (value && rule.date && !validateDate(value)) {
     errors[field] = "Invalid date";
     return;
   }
   if (value && rule.minLength && value.length < rule.minLength) {
     errors[field] = `Minimum length is ${rule.minLength} characters`;
     return;
   }
 });
 return errors;
};
