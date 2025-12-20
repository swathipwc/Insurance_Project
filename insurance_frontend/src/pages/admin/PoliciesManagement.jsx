import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { getAllPolicies, createPolicy, updatePolicy, assignPolicyToCustomer } from '../../services/policyService';
import { getAllCustomers } from '../../services/customerService';
import PolicyList from '../../components/policy/PolicyList';
import PolicyForm from '../../components/policy/PolicyForm';
import PolicyDetailsModal from '../../components/policy/PolicyDetailsModal';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import Pagination from '../../components/common/Pagination';
import { toast } from 'react-toastify';

const PoliciesManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [assigningPolicyId, setAssigningPolicyId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
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
    fetchPolicies();
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getAllPolicies(currentPage);
      // Response is now paginated: { content: [...], currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious }
      setPolicies(response.content || []);
      setPagination({
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        pageSize: response.pageSize || 10,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false
      });
      setError('');
    } catch (err) {
      setError('Failed to load policies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers(0);
      setCustomers(response.content || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter policies client-side for search (since backend pagination doesn't support search yet)
  const filteredPolicies = (() => {
    let filtered = [...policies];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(policy =>
        policy.policyCode?.toLowerCase().includes(query) ||
        policy.policyType?.toLowerCase().includes(query) ||
        policy.policyName?.toLowerCase().includes(query) ||
        policy.description?.toLowerCase().includes(query) ||
        policy.policyNumber?.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (filters.status) {
      filtered = filtered.filter(policy => {
        const policyStatus = policy.status?.toLowerCase() || '';
        return policyStatus === filters.status.toLowerCase();
      });
    }
    if (filters.policyType) {
      filtered = filtered.filter(policy => 
        policy.policyType?.toLowerCase() === filters.policyType.toLowerCase()
      );
    }

    return filtered;
  })();

  const handleCreate = () => {
    setEditingPolicy(null);
    setShowModal(true);
  };

  const handleView = (id) => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setSelectedPolicy(policy);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (id) => {
    // Only edit when explicitly clicking edit button, not view
    const policy = policies.find(p => p.id === id);
    if (policy) {
      setEditingPolicy(policy);
      setShowModal(true);
    }
  };

  const handleAssign = (id) => {
    setAssigningPolicyId(id);
    setSelectedCustomerId('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (assigning) {
      return;
    }

    try {
      setAssigning(true);
      await assignPolicyToCustomer(selectedCustomerId, assigningPolicyId);
      toast.success('Policy assigned successfully');
      setShowAssignModal(false);
      setSelectedCustomerId('');
      fetchPolicies();
    } catch (err) {
      // Display the error message from backend
      const errorMessage = err.message || 'Failed to assign policy';
      toast.error(errorMessage);
      console.error('Policy assignment error:', err);
    } finally {
      setAssigning(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingPolicy) {
        await updatePolicy(editingPolicy.id, formData);
        toast.success('Policy updated successfully');
        setShowModal(false);
        setEditingPolicy(null);
        setCurrentPage(0);
        fetchPolicies();
      } else {
        // Create new policy
        await createPolicy(formData);
        toast.success('Policy created successfully');
        setShowModal(false);
        setEditingPolicy(null);
        setCurrentPage(0);
        fetchPolicies();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save policy');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };


  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`
  }));

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
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Policies Management</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Manage insurance policies</p>
        </div>
        <Button variant="default" size="sm" onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Create Policy
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search policies by code, type, name, number, or description..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <PolicyList
          policies={filteredPolicies}
          onView={handleView}
          onEdit={handleEdit}
          onAssign={handleAssign}
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

      <Modal
        isOpen={showModal}
        onClose={() => {
          if (!submitting) {
            setShowModal(false);
            setEditingPolicy(null);
          }
        }}
        title={editingPolicy ? 'Edit Policy' : 'Create Policy'}
      >
        <PolicyForm
          policy={editingPolicy}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!submitting) {
              setShowModal(false);
              setEditingPolicy(null);
            }
          }}
          isLoading={submitting}
        />
      </Modal>

      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          if (!assigning) {
            setShowAssignModal(false);
            setSelectedCustomerId('');
          }
        }}
        title="Assign Policy to Customer"
      >
        <div className="space-y-4">
          <Select
            label="Customer"
            name="customerId"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            options={customerOptions}
            required
            disabled={assigning}
          />
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (!assigning) {
                  setShowAssignModal(false);
                  setSelectedCustomerId('');
                }
              }}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAssignSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={assigning}
            >
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                'Assign'
              )}
            </Button>
          </div>
        </div>
      </Modal>

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

export default PoliciesManagement;
