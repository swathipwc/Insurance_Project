import React, { useState } from 'react';
import Input from '../common/Input';

const PolicySearch = ({ onSearch, placeholder = 'Search by policy number or type...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-box">
      <Input
        name="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PolicySearch;

