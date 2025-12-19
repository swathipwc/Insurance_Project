import React, { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validators';
import { Card, CardContent } from '../common/Card';

const ClaimForm = ({ claim, policies = [], onSubmit, onCancel, submitting = false }) => {
  const [formData, setFormData] = useState({
    policyId: '',
    claimDate: '',
    claimAmount: '',
    description: '',
    evidenceUrl: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (claim) {
      setFormData({
        policyId: claim.policyId || '',
        claimDate: claim.claimDate ? claim.claimDate.split('T')[0] : '',
        claimAmount: claim.claimAmount || '',
        description: claim.description || '',
        evidenceUrl: claim.evidenceUrl || ''
      });
    }
  }, [claim]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData, {
      policyId: { required: true },
      claimDate: { required: true, date: true },
      claimAmount: { required: true, amount: true },
      description: { required: true, minLength: 10 }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const policyOptions = policies.map(policy => ({
    value: policy.id,
    label: `${policy.policyNumber} - ${policy.policyType}`
  }));

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* First row - 3 columns */}
          <div className="grid grid-cols-3 gap-2">
            {/* Policy Selection */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700 font-medium">
                Policy <span className="text-red-500">*</span>
              </label>
              <select
                name="policyId"
                value={formData.policyId}
                onChange={(e) => handleChange('policyId', e.target.value)}
                disabled={!!claim}
                className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Policy</option>
                {policyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.policyId && <p className="text-xs text-red-500">{errors.policyId}</p>}
            </div>

            {/* Date of Incident */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700 font-medium">
                Date of Incident <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="claimDate"
                value={formData.claimDate}
                onChange={(e) => handleChange('claimDate', e.target.value)}
                className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              {errors.claimDate && <p className="text-xs text-red-500">{errors.claimDate}</p>}
            </div>

            {/* Claim Amount */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700 font-medium">
                Claim Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="claimAmount"
                step="0.01"
                min="0"
                value={formData.claimAmount}
                onChange={(e) => handleChange('claimAmount', e.target.value)}
                placeholder="e.g., 5000.00"
                className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              {errors.claimAmount && <p className="text-xs text-red-500">{errors.claimAmount}</p>}
            </div>
          </div>

          {/* Description - Full width */}
          <div className="space-y-1">
            <label className="text-xs text-gray-700 font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the incident, what happened, and any relevant details..."
              rows={3}
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Evidence URL - Full width */}
          <div className="space-y-1">
            <label className="text-xs text-gray-700 font-medium">
              Evidence URL (Optional)
            </label>
            <input
              type="url"
              name="evidenceUrl"
              value={formData.evidenceUrl}
              onChange={(e) => handleChange('evidenceUrl', e.target.value)}
              placeholder="https://example.com/evidence.pdf"
              className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : (claim ? 'Update' : 'Submit') + ' Claim'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClaimForm;

