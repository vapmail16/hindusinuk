import React, { useState, useEffect } from 'react';
import { Grid, Pagination, Box } from '@mui/material';
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  where, 
  startAfter 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import BusinessCard from './BusinessCard';

const ITEMS_PER_PAGE = 6;

const BusinessList = ({ selectedCategory, searchQuery, sortBy }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    console.log('Filters changed:', { selectedCategory, searchQuery, sortBy });
    setPage(1); // Reset to first page when filters change
    fetchBusinesses();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const businessesRef = collection(db, 'businesses');
      let q = query(
        businessesRef,
        where('status', '==', 'approved')
      );

      // Apply search filter if query is at least 2 characters
      if (searchQuery && searchQuery.length >= 2) {
        console.log('Searching for:', searchQuery);
        const searchLower = searchQuery.toLowerCase();
        q = query(
          businessesRef,
          where('searchKeywords', 'array-contains', searchLower)
        );
      } else {
        // If no search, apply category and sort
        if (selectedCategory && selectedCategory !== 'all') {
          console.log('Filtering by category:', selectedCategory);
          
          // Determine sort field and direction
          const [field, direction] = sortBy.split('_');
          if (field === 'newest') {
            q = query(
              businessesRef,
              where('category', '==', selectedCategory),
              orderBy('createdAt', direction === 'desc' ? 'desc' : 'asc'),
              limit(ITEMS_PER_PAGE)
            );
          } else {
            q = query(
              businessesRef,
              where('category', '==', selectedCategory),
              orderBy('name', direction === 'desc' ? 'desc' : 'asc'),
              limit(ITEMS_PER_PAGE)
            );
          }
        } else {
          // No category filter, just sort
          const [field, direction] = sortBy.split('_');
          if (field === 'newest') {
            q = query(
              businessesRef,
              orderBy('createdAt', direction === 'desc' ? 'desc' : 'asc'),
              limit(ITEMS_PER_PAGE)
            );
          } else {
            q = query(
              businessesRef,
              orderBy('name', direction === 'desc' ? 'desc' : 'asc'),
              limit(ITEMS_PER_PAGE)
            );
          }
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      q = query(q, limit(ITEMS_PER_PAGE));

      console.log('Executing query...');
      const snapshot = await getDocs(q);
      const businessList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Found businesses:', businessList.length);
      setBusinesses(businessList);
      
      // Get total count for pagination
      const totalSnapshot = await getDocs(query(businessesRef));
      setTotalPages(Math.ceil(totalSnapshot.size / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {businesses.map((business) => (
          <Grid item xs={12} sm={6} md={4} key={business.id}>
            <BusinessCard business={business} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default BusinessList; 