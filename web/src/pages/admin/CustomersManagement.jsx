import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { getAllCustomers, createCustomer, updateCustomer } from '../../services/customerService';
import CustomerList from '../../components/customer/CustomerList';
import CustomerForm from '../../components/customer/CustomerForm';
import CustomerDetailsModal from '../../components/customer/CustomerDetailsModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import { toast } from 'react-toastify';

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    fetchCustomers();

    // Cleanup function
    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      // Sort by newest first (by createdAt descending)
      const sortedData = [...data].sort((a, b) => {
        // Primary sort: by createdAt (newest first)
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // If one has createdAt and other doesn't, prioritize the one with createdAt
        if (a.createdAt && !b.createdAt) return -1;
        if (!a.createdAt && b.createdAt) return 1;
        // Fallback: sort by customerCode if createdAt not available
        const getCustomerCodeNumber = (code) => {
          if (!code) return 0;
          const match = code.toString().match(/\d+$/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getCustomerCodeNumber(b.customerCode) - getCustomerCodeNumber(a.customerCode);
      });
      setCustomers(sortedData);
      setFilteredCustomers(sortedData);
      setError('');
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.customerCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleView = (customerCode) => {
    const customer = customers.find(c => c.customerCode === customerCode);
    if (customer) {
      setSelectedCustomer(customer);
      setShowDetailsModal(true);
    }
  };

  const handleEdit = (id) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setEditingCustomer(customer);
      setShowModal(true);
    }
  };


  const handleSubmit = async (formData) => {
    // Prevent multiple submissions
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(formData);
        toast.success('Customer created successfully');
      }
      setShowModal(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err.message || 'Failed to save customer');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">Manage customer information</p>
        </div>
        <Button variant="default" size="sm" onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers by name, email, or phone..."
        />
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <CustomerList
        customers={filteredCustomers}
        onView={handleView}
        onEdit={handleEdit}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          if (!submitting) {
            setShowModal(false);
            setEditingCustomer(null);
          }
        }}
        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (!submitting) {
              setShowModal(false);
              setEditingCustomer(null);
            }
          }}
          isLoading={submitting}
        />
      </Modal>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersManagement;
