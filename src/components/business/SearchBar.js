import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      placeholder="Search businesses..."
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      sx={{ flexGrow: 1, maxWidth: 400 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar; 