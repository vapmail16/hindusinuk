import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const SORT_OPTIONS = [
  { value: 'newest_desc', label: 'Newest First' },
  { value: 'newest_asc', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' }
];

const SortBy = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label="Sort By"
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortBy; 