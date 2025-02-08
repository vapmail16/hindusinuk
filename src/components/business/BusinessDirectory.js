import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button,
  Dialog,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import BusinessList from './BusinessList';
import BusinessCategories from './BusinessCategories';
import BusinessSearch from './BusinessSearch';
import BusinessForm from './BusinessForm';
import Login from '../auth/Login';
import FeaturedBusinesses from './FeaturedBusinesses';

const BusinessDirectory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [openForm, setOpenForm] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddBusinessClick = () => {
    if (user) {
      setOpenForm(true);
    } else {
      setOpenLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setOpenLogin(false);
    setOpenForm(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Hindu Business Directory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBusinessClick}
        >
          Add Business
        </Button>
      </Box>

      <FeaturedBusinesses />

      <BusinessSearch 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <BusinessCategories
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <BusinessList 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        sortBy={sortBy}
      />

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <BusinessForm 
          onClose={() => setOpenForm(false)}
          userId={user?.uid}
        />
      </Dialog>

      <Login
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLoginSuccess={handleLoginSuccess}
        returnPath="/business"
      />
    </Container>
  );
};

export default BusinessDirectory; 