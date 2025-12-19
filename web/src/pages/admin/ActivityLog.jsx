import React, { useState, useEffect, useRef } from 'react';
import { getActivityLogs } from '../../services/activityService';
import ActivityLogComponent from '../../components/activity/ActivityLog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import SearchInput from '../../components/common/SearchInput';
import AdvancedFilter from '../../components/common/AdvancedFilter';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (hasFetchedRef.current) {
      return;
    }
    hasFetchedRef.current = true;

    fetchActivities();

    // Cleanup function
    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivityLogs();
      setActivities(data);
      setFilteredActivities(data);
    } catch (err) {
      setError('Failed to load activity logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
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

    setFilteredActivities(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const actionTypes = [...new Set(activities.map(a => a.actionType))].map(type => ({
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

      <ActivityLogComponent activities={filteredActivities} />
    </div>
  );
};

export default ActivityLog;

