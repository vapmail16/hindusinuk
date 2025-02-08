import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' }
];

const BusinessSearch = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 4,
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search businesses..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const LocationSearch = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  
  // We can use Google Places Autocomplete API here
  return (
    <Autocomplete
      options={suggestions}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          variant="outlined"
          placeholder="Search by city or postcode"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default BusinessSearch; 