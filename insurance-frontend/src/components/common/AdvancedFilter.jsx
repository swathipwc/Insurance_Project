import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Button from './Button';
import Select from './Select';

const AdvancedFilter = ({ 
  filters = [], 
  onFilterChange, 
  onReset,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (key, value) => {
    const newValues = { ...filterValues, [key]: value };
    setFilterValues(newValues);
  };

  const handleApply = () => {
    onFilterChange?.(filterValues);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilterValues({});
    onReset?.();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-7 w-7 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Advanced Filter"
        title="Advanced Filter"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg p-3 space-y-3 shadow-lg z-50">
            {filters.map((filter) => (
              <div key={filter.key}>
                <p className="text-[10px] font-semibold text-gray-700 mb-1.5">{filter.label}</p>
                {filter.type === 'select' ? (
                  <Select
                    name={filter.key}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    options={filter.options || []}
                    placeholder={filter.placeholder || 'Select...'}
                    className="h-6 text-[10px]"
                  />
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="h-6 w-full px-2 py-1 border border-gray-300 rounded-md text-[10px]"
                  />
                ) : filter.type === 'number' ? (
                  <input
                    type="number"
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder || 'Enter number'}
                    className="h-6 w-full px-2 py-1 border border-gray-300 rounded-md text-[10px]"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <input
                    type="text"
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="h-6 w-full px-2 py-1 border border-gray-300 rounded-md text-[10px]"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-6 px-2 text-[10px] flex-1"
              >
                Reset
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApply}
                className="h-6 px-2 text-[10px] flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedFilter;
