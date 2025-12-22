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

      // Filter phone to digits only when loading customer data

      const phoneDigitsOnly = customer.phone

        ? customer.phone.replace(/\D/g, "")

        : "";

      setFormData({

        name: customer.name || "",

        email: customer.email || "",

        phone: phoneDigitsOnly,

        address: customer.address || "",

      });

      // Clear errors when loading customer data

      setErrors({});

    } else {

      // Reset form when no customer (creating new)

      setFormData({

        name: "",

        email: "",

        phone: "",

        address: "",

      });

      setErrors({});

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

      if (limitedValue.length < 10 && limitedValue.length > 0) {

        setErrors((prev) => ({

          ...prev,

          phone: `Phone number must contain exactly 10 digits (currently ${limitedValue.length})`,

        }));

      } else if (limitedValue.length === 10) {

        // Clear error if valid (exactly 10 digits)

        setErrors((prev) => ({ ...prev, [name]: "" }));

      } else if (limitedValue.length === 0 && errors[name]) {

        // Keep error if empty and there was an error

        // Error will be shown on blur or submit

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
 
