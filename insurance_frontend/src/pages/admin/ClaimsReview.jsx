import React, { useState, useEffect } from 'react';
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
import Pagination from '../../components/common/Pagination';
import { CLAIM_STATUS } from '../../utils/constants';
import { toast } from 'react-toastify';

const ClaimsReview = () => {
  const [claims, setClaims] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false
  });

  useEffect(() => {
    fetchClaims();
  }, [currentPage, filters]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        status: filters.status || null,
        from: filters.startDate || null,
        to: filters.endDate || null
      };
      const response = await getAllClaims(apiFilters, currentPage);
      // Response is now paginated: { content: [...], currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious }
      setClaims(response.content || []);
      setPagination({
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        pageSize: response.pageSize || 10,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false
      });
      setError('');
    } catch (err) {
      setError('Failed to load claims. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter claims client-side for search (since backend pagination doesn't support search yet)
  const filteredClaims = searchQuery.trim() 
    ? claims.filter(claim => {
        const query = searchQuery.toLowerCase();
        return (
          claim.claimNumber?.toLowerCase().includes(query) ||
          claim.policyNumber?.toLowerCase().includes(query) ||
          claim.description?.toLowerCase().includes(query) ||
          claim.remarks?.toLowerCase().includes(query)
        );
      })
    : claims;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleFilterReset = () => {
    setFilters({});
    setCurrentPage(0);
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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ClaimList
          claims={filteredClaims}
          onView={handleView}
          onUpdate={handleUpdate}
          showPolicy={true}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          hasNext={pagination.hasNext}
          hasPrevious={pagination.hasPrevious}
          onPageChange={handlePageChange}
        />
      </div>

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
