import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import SpaIcon from '@mui/icons-material/Spa';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'Restaurant', label: 'Restaurants', icon: <RestaurantIcon /> },
  { id: 'Grocery', label: 'Groceries', icon: <ShoppingBasketIcon /> },
  { id: 'Fashion', label: 'Fashion', icon: <CheckroomIcon /> },
  { id: 'Religious', label: 'Religious', icon: <TempleHinduIcon /> },
  { id: 'Health', label: 'Health & Wellness', icon: <SpaIcon /> }
];

const BusinessCategories = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {CATEGORIES.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            icon={category.icon}
            onClick={() => onCategoryChange(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
            sx={{ 
              '&:hover': { 
                bgcolor: selectedCategory === category.id ? 'primary.main' : 'rgba(0, 0, 0, 0.04)' 
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BusinessCategories; 