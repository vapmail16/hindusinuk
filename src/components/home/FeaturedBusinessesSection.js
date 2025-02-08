import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Link,
  Skeleton
} from '@mui/material';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

const FeaturedBusinessesSection = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, []);

  const fetchFeaturedBusinesses = async () => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('status', '==', 'approved'),
        where('isFeatured', '==', true),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const businessList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (businessList.length === 0) {
        const fallbackQ = query(
          collection(db, 'businesses'),
          where('status', '==', 'approved'),
          limit(5)
        );
        const fallbackSnapshot = await getDocs(fallbackQ);
        const fallbackList = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBusinesses(fallbackList);
      } else {
        setBusinesses(businessList);
      }
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="section">
      {/* Header with single line */}
      <Box sx={{ mb: 4, mt: 2 }}>
        {/* Line with centered title */}
        <Box sx={{ 
          borderBottom: '1px solid #e0e0e0',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          mb: 2
        }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 500,
              color: '#2196f3',
              textAlign: 'center',
              bgcolor: 'white',
              px: 3,
              position: 'relative',
              top: '50%',
              transform: 'translateY(50%)'
            }}
          >
            Featured Businesses
          </Typography>
        </Box>

        {/* VIEW ALL link */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/business')}
            sx={{ 
              color: '#2196f3',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            VIEW ALL
          </Link>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : businesses.length > 0 ? (
          businesses.map(business => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={business.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={business.images?.[0] || '/images/business-placeholder.png'}
                  alt={business.name}
                />
                <CardContent>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontSize: '1.1rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {business.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {business.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No featured businesses available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FeaturedBusinessesSection; 