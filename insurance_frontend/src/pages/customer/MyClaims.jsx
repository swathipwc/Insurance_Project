import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyClaims } from '../../services/claimService';
import ClaimList from '../../components/claim/ClaimList';
import ClaimDetailsModal from '../../components/claim/ClaimDetailsModal';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CLAIM_STATUS } from '../../utils/constants';

const MyClaims = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyClaims();
        // Map API response to match UI expectations
        const mappedClaims = data.map(claim => {
          // Map status from enum to display format if needed
          let status = claim.status;
          if (typeof status === 'string') {
            // Convert enum values to display format
            const statusMap = {
              'SUBMITTED': 'Submitted',
              'IN_REVIEW': 'In Review',
              'APPROVED': 'Approved',
              'REJECTED': 'Rejected'
            };
            status = statusMap[status] || status;
          }
          
          return {
            id: claim.id,
            claimNumber: claim.claimNumber || `CLM-${claim.id}`,
            policyNumber: claim.policyNumber || 'N/A',
            claimDate: claim.claimDate,
            claimAmount: claim.claimAmount,
            status: status,
            description: claim.description,
            remarks: claim.remarks,
            evidenceUrl: claim.evidenceUrl,
            createdAt: claim.createdAt
          };
        });
        setClaims(mappedClaims);
        setFilteredClaims(mappedClaims);
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('Failed to load claims. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  useEffect(() => {
    filterClaims();
  }, [claims, searchQuery, filters]);

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

  const handleView = (id) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      setSelectedClaim(claim);
      setShowDetailsModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };


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
          <h1 className="text-xl font-bold text-gray-900">My Claims</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Track all your claim requests</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {claims.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-600">No claims found. Submit a new claim to get started.</p>
        </div>
      ) : (
        <>
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
          />
        </>
      )}

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClaim(null);
        }}
        claim={selectedClaim}
      />
    </div>
  );
};

export default MyClaims;
