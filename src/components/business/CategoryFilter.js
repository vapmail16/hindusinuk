import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  ShoppingBasket as GroceryIcon,
  Checkroom as FashionIcon,
  Temple as ReligiousIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'Restaurant', label: 'Restaurants', icon: <RestaurantIcon /> },
  { id: 'Grocery', label: 'Groceries', icon: <GroceryIcon /> },
  { id: 'Fashion', label: 'Fashion', icon: <FashionIcon /> },
  { id: 'Religious', label: 'Religious', icon: <ReligiousIcon /> },
  { id: 'Health', label: 'Health & Wellness', icon: <HealthIcon /> }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Box sx={{ overflowX: 'auto', mb: 2 }}>
      <ButtonGroup 
        variant="outlined" 
        sx={{ 
          display: 'flex',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: 1
        }}
      >
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
            startIcon={category.icon}
            sx={{ 
              whiteSpace: 'nowrap',
              flex: { xs: '1 1 auto', md: '0 1 auto' }
            }}
          >
            {category.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default CategoryFilter; 