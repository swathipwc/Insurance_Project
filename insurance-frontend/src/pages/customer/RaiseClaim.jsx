import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyPolicies } from '../../services/policyService';
import { createClaim } from '../../services/claimService';
import ClaimForm from '../../components/claim/ClaimForm';
import Alert from '../../components/common/Alert';
import { toast } from 'react-toastify';

const RaiseClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const data = await getMyPolicies();
        // Only show active policies
        const activePolicies = (data || []).filter(p => p.status === 'ACTIVE');
        setPolicies(activePolicies);
      } catch (err) {
        console.error('Error fetching policies:', err);
        setError('Failed to load policies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      await createClaim({
        policyId: formData.policyId,
        claimDate: formData.claimDate,
        claimAmount: parseFloat(formData.claimAmount),
        description: formData.description,
        evidenceUrl: formData.evidenceUrl || null
      });
      
      toast.success('Claim submitted successfully!');
      navigate('/customer/claims');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit claim. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Raise Claim</h1>
            <p className="text-[10px] text-gray-600 font-medium mt-0.5">Submit a new claim request</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">Loading policies...</p>
        </div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Raise Claim</h1>
            <p className="text-[10px] text-gray-600 font-medium mt-0.5">Submit a new claim request</p>
          </div>
        </div>
        <Alert type="info" message="You need at least one active policy to raise a claim." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Raise Claim</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Submit a new claim request</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="max-w-2xl">
        <ClaimForm
          policies={policies.map(p => ({
            id: p.policyId,
            policyNumber: p.policyNumber,
            policyType: p.policyType
          }))}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customer/claims')}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default RaiseClaim;

