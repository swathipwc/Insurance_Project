import React, { useState } from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { CLAIM_STATUS } from '../../utils/constants';

const ClaimFilter = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: ''
    });
    onReset();
  };

  const statusOptions = Object.values(CLAIM_STATUS).map(status => ({
    value: status,
    label: status
  }));

  return (
    <div className="filters">
      <div className="filter-group">
        <Select
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleChange}
          options={statusOptions}
          placeholder="All Statuses"
        />
      </div>
      <div className="filter-group">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-sm)' }}>
        <Button variant="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ClaimFilter;

