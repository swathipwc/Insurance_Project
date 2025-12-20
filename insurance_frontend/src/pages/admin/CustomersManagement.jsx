import React, { useState, useEffect } from 'react';
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
import Pagination from '../../components/common/Pagination';
import { toast } from 'react-toastify';

const CustomersManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers(currentPage);
      // Response is now paginated: { content: [...], currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious }
      setCustomers(response.content || []);
      setPagination({
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        pageSize: response.pageSize || 10,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false
      });
      setError('');
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  // Filter customers client-side for search (since backend pagination doesn't support search yet)
  const filteredCustomers = searchQuery.trim() 
    ? customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.customerCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers;


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
      // Reset to first page after creating/updating
      setCurrentPage(0);
      fetchCustomers();
    } catch (err) {
      toast.error(err.message || 'Failed to save customer');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <CustomerList
          customers={filteredCustomers}
          onView={handleView}
          onEdit={handleEdit}
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
