import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Carousel from 'react-material-ui-carousel';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import BusinessCard from './BusinessCard';

const FeaturedBusinesses = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, []);

  const fetchFeaturedBusinesses = async () => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('isFeatured', '==', true),
        limit(5)
      );
      
      const snapshot = await getDocs(q);
      const businesses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFeaturedBusinesses(businesses);
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Featured Businesses
        </Typography>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (featuredBusinesses.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Featured Businesses
      </Typography>
      <Carousel
        animation="slide"
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: {
            backgroundColor: 'rgba(255, 107, 0, 0.3)',
            borderRadius: 0
          }
        }}
        NextIcon={<NavigateNext />}
        PrevIcon={<NavigateBefore />}
        sx={{
          minHeight: '300px',
          '& .MuiPaper-root': {
            backgroundColor: 'transparent'
          }
        }}
      >
        {featuredBusinesses.map((business) => (
          <Box 
            key={business.id}
            sx={{ 
              p: 2,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ maxWidth: 400 }}>
              <BusinessCard business={business} featured />
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default FeaturedBusinesses; 