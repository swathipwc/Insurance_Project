import React, { useState, useEffect, useRef } from 'react';
import { getAllClaims, updateClaimStatus } from '../../services/claimService';
import ClaimList from '../../components/claim/ClaimList';
import ClaimDetailsModal from '../../components/claim/ClaimDetailsModal';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import { CLAIM_STATUS } from '../../utils/constants';
import { toast } from 'react-toastify';

const ClaimsReview = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewingClaim, setViewingClaim] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    fetchClaims();

    // Cleanup function
    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  useEffect(() => {
    filterClaims();
  }, [claims, searchQuery, filters]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await getAllClaims();
      setClaims(data);
      setFilteredClaims(data);
    } catch (err) {
      setError('Failed to load claims. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterClaims = () => {
    let filtered = [...claims];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(claim =>
        claim.claimNumber?.toLowerCase().includes(query) ||
        claim.policyNumber?.toLowerCase().includes(query) ||
        claim.description?.toLowerCase().includes(query) ||
        claim.remarks?.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (filters.status) {
      filtered = filtered.filter(claim => {
        const claimStatus = claim.status?.toLowerCase() || '';
        return claimStatus === filters.status.toLowerCase();
      });
    }
    if (filters.startDate) {
      filtered = filtered.filter(claim => {
        if (!claim.claimDate) return false;
        return new Date(claim.claimDate) >= new Date(filters.startDate);
      });
    }
    if (filters.endDate) {
      filtered = filtered.filter(claim => {
        if (!claim.claimDate) return false;
        return new Date(claim.claimDate) <= new Date(filters.endDate);
      });
    }
    if (filters.minAmount) {
      filtered = filtered.filter(claim => 
        claim.claimAmount && parseFloat(claim.claimAmount) >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(claim => 
        claim.claimAmount && parseFloat(claim.claimAmount) <= parseFloat(filters.maxAmount)
      );
    }

    setFilteredClaims(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  const handleView = (id) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      setViewingClaim(claim);
      setShowDetailsModal(true);
    }
  };

  const handleUpdate = (id) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      setSelectedClaim(claim);
      setStatus(claim.status);
      setRemarks(claim.remarks || '');
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateClaimStatus(selectedClaim.id, status, remarks);
      toast.success('Claim status updated successfully');
      setShowModal(false);
      fetchClaims();
    } catch (err) {
      toast.error('Failed to update claim status');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const statusOptions = Object.values(CLAIM_STATUS).map(s => ({
    value: s,
    label: s
  }));

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
      placeholder: 'Select status'
    },
    {
      key: 'startDate',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'To Date',
      type: 'date'
    },
    {
      key: 'minAmount',
      label: 'Min Amount',
      type: 'number',
      placeholder: 'Minimum amount'
    },
    {
      key: 'maxAmount',
      label: 'Max Amount',
      type: 'number',
      placeholder: 'Maximum amount'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Claims Review</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Review and update claim status</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search claims by number, policy, or description..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <ClaimList
        claims={filteredClaims}
        onView={handleView}
        onUpdate={handleUpdate}
        showPolicy={true}
      />

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setViewingClaim(null);
        }}
        claim={viewingClaim}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Update Claim Status"
      >
        {selectedClaim && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-[10px] text-gray-600 mb-1">
                <span className="font-medium">Claim ID:</span> {selectedClaim.id}
              </p>
              <p className="text-[10px] text-gray-600 mb-1">
                <span className="font-medium">Amount:</span> ₹{selectedClaim.claimAmount}
              </p>
              <p className="text-[10px] text-gray-600">
                <span className="font-medium">Description:</span> {selectedClaim.description}
              </p>
            </div>

            <Select
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              required
            />

            <Input
              label="Remarks"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks (optional)"
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClaimsReview;
