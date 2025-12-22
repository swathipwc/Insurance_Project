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
   // Update form data first
   setFormData((prev) => ({ ...prev, [name]: value }));
   // For phone field, check for invalid characters immediately
   if (name === "phone") {
     if (value && hasInvalidPhoneCharacters(value)) {
       setErrors((prev) => ({
         ...prev,
         phone:
           "Phone number can only contain numbers and formatting characters (spaces, dashes, parentheses, plus sign)",
       }));
     } else if (errors[name] && value && !hasInvalidPhoneCharacters(value)) {
       // Clear error if user types valid characters
       setErrors((prev) => ({ ...prev, [name]: "" }));
     }
   } else {
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
         phone:
           "Phone number can only contain numbers and formatting characters (spaces, dashes, parentheses, plus sign)",
       }));
     } else if (!validatePhone(value)) {
       const digitsOnly = value.replace(/\D/g, "");
       if (digitsOnly.length === 0) {
         setErrors((prev) => ({
           ...prev,
           phone: "Phone number must contain exactly 10 digits",
         }));
       } else if (digitsOnly.length < 10) {
         setErrors((prev) => ({
           ...prev,
           phone: `Phone number must contain exactly 10 digits (currently ${digitsOnly.length})`,
         }));
       } else if (digitsOnly.length > 10) {
         setErrors((prev) => ({
           ...prev,
           phone: `Phone number must contain exactly 10 digits (currently ${digitsOnly.length})`,
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
       placeholder="e.g., 1234567890 or (123) 456-7890"
       required
       maxLength={20}
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
