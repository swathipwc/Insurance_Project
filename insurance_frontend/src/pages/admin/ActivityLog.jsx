import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../services/activityService';
import ActivityLogComponent from '../../components/activity/ActivityLog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';
import Pagination from '../../components/common/Pagination';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    fetchActivities();
  }, [currentPage]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivityLogs(currentPage);
      // Response is now paginated: { content: [...], currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious }
      setActivities(response.content || []);
      setPagination({
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        pageSize: response.pageSize || 10,
        hasNext: response.hasNext || false,
        hasPrevious: response.hasPrevious || false
      });
      setError('');
    } catch (err) {
      setError('Failed to load activity logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter activities client-side for search (since backend pagination doesn't support search yet)
  const filteredActivities = (() => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(activity =>
        activity.actionType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.actionType) {
      filtered = filtered.filter(activity => activity.actionType === filters.actionType);
    }
    if (filters.startDate) {
      filtered = filtered.filter(activity => new Date(activity.createdAt) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(activity => new Date(activity.createdAt) <= new Date(filters.endDate));
    }

    return filtered;
  })();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleFilterReset = () => {
    setFilters({});
    setCurrentPage(0);
  };


  // Get unique action types from all activities (including filtered)
  const allActionTypes = [...new Set(activities.map(a => a.actionType))];
  const actionTypes = allActionTypes.map(type => ({
    value: type,
    label: type
  }));

  const filterOptions = [
    {
      key: 'actionType',
      label: 'Action Type',
      type: 'select',
      options: actionTypes,
      placeholder: 'Select action type'
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
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-[10px] text-gray-600 font-medium mt-0.5">View system activity and audit trail</p>
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
          placeholder="Search activities by action type, username, or details..."
        />
        <AdvancedFilter
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleFilterReset}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ActivityLogComponent activities={filteredActivities} loading={loading} />
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
    </div>
  );
};

export default ActivityLog;

