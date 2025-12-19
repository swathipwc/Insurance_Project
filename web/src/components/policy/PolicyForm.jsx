import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { POLICY_TYPES, POLICY_STATUS } from '../../utils/constants';
import { validateForm } from '../../utils/validators';

const PolicyForm = ({ policy, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    policyType: '',
    coverageAmount: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (policy) {
      setFormData({
        policyType: policy.policyType || '',
        coverageAmount: policy.coverageAmount || '',
        startDate: policy.startDate ? (policy.startDate.split('T')[0] || policy.startDate) : '',
        endDate: policy.endDate ? (policy.endDate.split('T')[0] || policy.endDate) : '',
        status: policy.status || 'ACTIVE'
      });
    }
  }, [policy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent submission if already loading
    if (isLoading) {
      return;
    }
    
    const validationErrors = validateForm(formData, {
      policyType: { required: true },
      coverageAmount: { required: true, amount: true },
      startDate: { required: true, date: true },
      endDate: { required: true, date: true }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // When creating (not editing), always set status to ACTIVE
    const submitData = policy 
      ? formData  // When editing, use form data as is
      : { ...formData, status: 'ACTIVE' };  // When creating, force ACTIVE

    onSubmit(submitData);
  };

  const policyTypeOptions = POLICY_TYPES.map(type => ({
    value: type.toUpperCase(),
    label: type
  }));

  const statusOptions = POLICY_STATUS.map(status => ({
    value: status.toUpperCase(),
    label: status
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Policy Type"
        name="policyType"
        value={formData.policyType}
        onChange={handleChange}
        options={policyTypeOptions}
        error={errors.policyType}
        required
      />

      <Input
        label="Coverage Amount"
        name="coverageAmount"
        type="number"
        step="0.01"
        value={formData.coverageAmount}
        onChange={handleChange}
        error={errors.coverageAmount}
        required
      />

      <Input
        label="Start Date"
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        error={errors.startDate}
        required
      />

      <Input
        label="End Date"
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        error={errors.endDate}
        required
      />

      {/* Only show status field when editing, not when creating */}
      {policy && (
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />
      )}

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
              {policy ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            `${policy ? 'Update' : 'Create'} Policy`
          )}
        </Button>
      </div>
    </form>
  );
};

export default PolicyForm;

