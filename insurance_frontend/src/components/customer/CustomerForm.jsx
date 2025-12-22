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

    if (name === "phone") {
      // Sanitize input: only keep digits, max 10 chars
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));

      // Validate and update errors
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setErrors((prev) => ({
          ...prev,
          phone: `Phone number must contain exactly 10 digits (currently ${digitsOnly.length})`,
        }));
      } else if (digitsOnly.length === 10) {
        // Clear phone error if valid
        if (errors.phone) {
          setErrors((prev) => ({ ...prev, phone: "" }));
        }
      } else {
        // Clear error if empty
        if (errors.phone) {
          setErrors((prev) => ({ ...prev, phone: "" }));
        }
      }
    } else {
      // Other fields
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for the field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Validation on blur for phone
      if (!value || value.trim() === "") {
        setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
        return;
      }
      if (hasInvalidPhoneCharacters(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number can only contain numbers (0-9)",
        }));
        return;
      }
      if (!validatePhone(value)) {
        const len = value.length;
        setErrors((prev) => ({
          ...prev,
          phone: `Phone number must contain exactly 10 digits (currently ${len})`,
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;

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
            customer ? "Update Customer" : "Create Customer"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
