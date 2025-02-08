import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Button,
  Divider,
  Chip,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  Language,
  Phone,
  Email,
  LocationOn,
  ArrowBack
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const docRef = doc(db, 'businesses', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setBusiness({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Business not found');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setError('Error loading business details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !business) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/business')}>
          Back to Directory
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/business')}
        sx={{ mb: 2 }}
      >
        Back to Directory
      </Button>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Logo/Image Section */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={business.logo || '/images/business-placeholder.png'}
              alt={business.name}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                bgcolor: 'grey.50',
                borderRadius: 1
              }}
            />
          </Grid>

          {/* Business Info Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {business.name}
            </Typography>
            
            <Chip 
              label={business.category} 
              color="primary" 
              sx={{ mb: 2 }}
            />

            <Typography variant="body1" paragraph>
              {business.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Contact Information */}
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                {business.address}
              </Typography>

              {business.contact?.phone && (
                <Typography variant="body1">
                  <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {business.contact.phone}
                </Typography>
              )}

              {business.contact?.email && (
                <Typography variant="body1">
                  <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {business.contact.email}
                </Typography>
              )}

              {business.contact?.website && (
                <Typography variant="body1">
                  <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <a 
                    href={business.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {business.contact.website}
                  </a>
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Additional sections can be added here */}
    </Container>
  );
};

const LoadingSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" height={100} />
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Box>
      </Grid>
    </Grid>
  </Container>
);

export default BusinessDetails; 