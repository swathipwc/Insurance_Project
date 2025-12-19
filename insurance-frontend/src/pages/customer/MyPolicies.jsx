import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyPolicies } from '../../services/policyService';
import PolicyList from '../../components/policy/PolicyList';
import PolicyDetailsModal from '../../components/policy/PolicyDetailsModal';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';

const MyPolicies = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const data = await getMyPolicies();
        setPolicies(data || []);
        setFilteredPolicies(data || []);
      } catch (err) {
        console.error('Error fetching policies:', err);
        setError('Failed to load policies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user]);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchQuery, filters]);

  const filterPolicies = () => {
    let filtered = [...policies];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(policy =>
        policy.policyNumber?.toLowerCase().includes(query) ||
        policy.policyType?.toLowerCase().includes(query) ||
        policy.policyCode?.toLowerCase().includes(query) ||
        policy.policyName?.toLowerCase().includes(query) ||
        policy.description?.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (filters.policyType) {
      filtered = filtered.filter(policy => 
        policy.policyType?.toLowerCase() === filters.policyType.toLowerCase()
      );
    }
    if (filters.status) {
      filtered = filtered.filter(policy => {
        const policyStatus = policy.status?.toLowerCase() || '';
        const filterStatus = filters.status.toLowerCase();
        // Handle both enum values and display values
        const statusMap = {
          'active': ['active', 'active'],
          'inactive': ['inactive', 'inactive'],
          'expired': ['expired', 'expired']
        };
        return policyStatus === filterStatus || 
               (statusMap[filterStatus] && statusMap[filterStatus].includes(policyStatus));
      });
    }
    if (filters.startDate) {
      filtered = filtered.filter(policy => {
        if (!policy.startDate) return false;
        return new Date(policy.startDate) >= new Date(filters.startDate);
      });
    }
    if (filters.endDate) {
      filtered = filtered.filter(policy => {
        if (!policy.endDate) return false;
        return new Date(policy.endDate) <= new Date(filters.endDate);
      });
    }

    setFilteredPolicies(filtered);
  };

  const handleView = (id) => {
    const policy = policies.find(p => p.policyId === id);
    if (policy) {
      // Map status and ensure all fields are present
      let status = policy.status;
      if (typeof status === 'string') {
        const statusMap = {
          'ACTIVE': 'Active',
          'INACTIVE': 'Inactive',
          'EXPIRED': 'Expired'
        };
        status = statusMap[status] || status;
      }
      
      setSelectedPolicy({
        ...policy,
        policyId: policy.policyId,
        status: status
      });
      setShowDetailsModal(true);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };


  const policyTypes = [...new Set(policies.map(p => p.policyType))].map(type => ({
    value: type,
    label: type
  }));

  const filterOptions = [
    {
      key: 'policyType',
      label: 'Policy Type',
      type: 'select',
      options: policyTypes,
      placeholder: 'Select type'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Expired', label: 'Expired' }
      ],
      placeholder: 'Select status'
    },
    {
      key: 'startDate',
      label: 'Start Date From',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'End Date To',
      type: 'date'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Policies</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">View all your insurance policies</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">Loading policies...</p>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search policies by number, type, code, name, or description..."
            />
            <AdvancedFilter
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>

          <PolicyList
            policies={filteredPolicies.map(p => {
              // Map status from enum to display format
              let status = p.status;
              if (typeof status === 'string') {
                const statusMap = {
                  'ACTIVE': 'Active',
                  'INACTIVE': 'Inactive',
                  'EXPIRED': 'Expired'
                };
                status = statusMap[status] || status;
              }
              
              return {
                id: p.policyId,
                policyId: p.policyId,
                policyCode: p.policyCode,
                policyNumber: p.policyNumber,
                policyType: p.policyType,
                coverageAmount: p.coverageAmount,
                startDate: p.startDate,
                endDate: p.endDate,
                status: status
              };
            })}
            onView={handleView}
            showCustomer={true}
          />
        </>
      )}

      {/* Policy Details Modal */}
      <PolicyDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPolicy(null);
        }}
        policy={selectedPolicy}
      />
    </div>
  );
};

export default MyPolicies;
