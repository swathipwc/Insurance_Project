import React, { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";

import Input from "../common/Input";

import Button from "../common/Button";

import {

  validateForm,

  validatePhone,

  hasInvalidPhoneCharacters,

} from "../../utils/validators";

const CustomerForm = ({ customer, onSubmit, onCancel, isLoading = false }) => {

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    phone: "",

    address: "",

  });

  const [errors, setErrors] = useState({});

  useEffect(() => {

    if (customer) {

      setFormData({

        name: customer.name || "",

        email: customer.email || "",

        phone: customer.phone || "",

        address: customer.address || "",

      });

    }

  }, [customer]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    // For phone field, only allow digits and limit to 10 characters

    if (name === "phone") {

      // Filter out any non-digit characters

      const digitsOnly = value.replace(/\D/g, "");

      // Limit to 10 digits

      const limitedValue = digitsOnly.slice(0, 10);

      setFormData((prev) => ({ ...prev, [name]: limitedValue }));

      // Validate and show errors

      if (limitedValue && hasInvalidPhoneCharacters(limitedValue)) {

        setErrors((prev) => ({

          ...prev,

          phone: "Phone number can only contain numbers (0-9)",

        }));

      } else if (limitedValue.length < 10 && limitedValue.length > 0) {

        setErrors((prev) => ({

          ...prev,

          phone: `Phone number must contain exactly 10 digits (currently ${limitedValue.length})`,

        }));

      } else if (errors[name] && limitedValue.length === 10) {

        // Clear error if valid (exactly 10 digits)

        setErrors((prev) => ({ ...prev, [name]: "" }));

      }

    } else {

      // Update form data for other fields

      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for other fields when user starts typing

      if (errors[name]) {

        setErrors((prev) => ({ ...prev, [name]: "" }));

      }

    }

  };

  const handleBlur = (e) => {

    const { name, value } = e.target;

    // Validate phone number on blur for real-time feedback

    if (name === "phone") {

      if (!value || value.trim() === "") {

        setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));

      } else if (hasInvalidPhoneCharacters(value)) {

        setErrors((prev) => ({

          ...prev,

          phone: "Phone number can only contain numbers (0-9)",

        }));

      } else if (!validatePhone(value)) {

        if (value.length === 0) {

          setErrors((prev) => ({

            ...prev,

            phone: "Phone number must contain exactly 10 digits",

          }));

        } else if (value.length < 10) {

          setErrors((prev) => ({

            ...prev,

            phone: `Phone number must contain exactly 10 digits (currently ${value.length})`,

          }));

        } else if (value.length > 10) {

          setErrors((prev) => ({

            ...prev,

            phone: `Phone number must contain exactly 10 digits (currently ${value.length})`,

          }));

        } else {

          setErrors((prev) => ({

            ...prev,

            phone: "Phone number must contain exactly 10 digits",

          }));

        }

      } else {

        // Clear error if valid

        setErrors((prev) => ({ ...prev, phone: "" }));

      }

    }

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    // Prevent submission if already loading

    if (isLoading) {

      return;

    }

    const validationErrors = validateForm(formData, {

      name: { required: true, minLength: 2 },

      email: { required: true, email: true },

      phone: { required: true, phone: true },

      address: { required: true, minLength: 5 },

    });

    if (Object.keys(validationErrors).length > 0) {

      setErrors(validationErrors);

      return;

    }

    onSubmit(formData);

  };

  return (
<form onSubmit={handleSubmit} className="space-y-4">
<Input

        label="Name"

        name="name"

        value={formData.name}

        onChange={handleChange}

        error={errors.name}

        required

      />
<Input

        label="Email"

        name="email"

        type="email"

        value={formData.email}

        onChange={handleChange}

        error={errors.email}

        required

      />
<Input

        label="Phone"

        name="phone"

        type="tel"

        value={formData.phone}

        onChange={handleChange}

        onBlur={handleBlur}

        error={errors.phone}

        placeholder="Enter 10 digit phone number"

        required

        maxLength={10}

      />
<Input

        label="Address"

        name="address"

        value={formData.address}

        onChange={handleChange}

        error={errors.address}

        required

      />
<div className="flex items-center justify-end gap-2 pt-4 border-t">
<Button

          type="button"

          variant="outline"

          size="sm"

          onClick={onCancel}

          disabled={isLoading}
>

          Cancel
</Button>
<Button

          type="submit"

          variant="default"

          size="sm"

          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"

          disabled={isLoading}
>

          {isLoading ? (
<>
<Loader2 className="h-4 w-4 animate-spin mr-2" />

              {customer ? "Updating..." : "Creating..."}
</>

          ) : (

            `${customer ? "Update" : "Create"} Customer`

          )}
</Button>
</div>
</form>

  );

};

export default CustomerForm;
 
export const validateEmail = (email) => {

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return re.test(email);

};

export const validatePhone = (phone) => {

  if (!phone || phone.trim() === "") {

    return false;

  }

  // Only allow digits (0-9)

  const re = /^[0-9]+$/;

  if (!re.test(phone)) {

    return false;

  }

  // Check for exactly 10 digits

  return phone.length === 10;

};

export const hasInvalidPhoneCharacters = (phone) => {

  if (!phone) {

    return false;

  }

  // Check if phone contains any non-digit characters

  // Only digits (0-9) are allowed

  const invalidChars = /[^0-9]/;

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

      // First check for invalid characters (non-digits)

      if (hasInvalidPhoneCharacters(value)) {

        errors[field] = "Phone number can only contain numbers (0-9)";

        return;

      }

      // Then check phone format (exactly 10 digits)

      if (!validatePhone(value)) {

        if (value.length === 0) {

          errors[field] = "Phone number is required";

        } else if (value.length < 10) {

          errors[

            field

          ] = `Phone number must contain exactly 10 digits (currently ${value.length})`;

        } else if (value.length > 10) {

          errors[

            field

          ] = `Phone number must contain exactly 10 digits (currently ${value.length})`;

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
 
