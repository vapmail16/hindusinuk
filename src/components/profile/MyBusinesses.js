import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Dialog
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessForm from '../business/BusinessForm';

const MyBusinesses = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchMyBusinesses();
  }, [user]);

  const fetchMyBusinesses = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'businesses'),
        where('ownerId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const businessList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBusinesses(businessList);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setOpenForm(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">My Businesses</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedBusiness(null);
            setOpenForm(true);
          }}
        >
          Add Business
        </Button>
      </Box>

      <Grid container spacing={2}>
        {businesses.map((business) => (
          <Grid item xs={12} key={business.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{business.name}</Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {business.category}
                    </Typography>
                    <Typography variant="body2">
                      Status: {business.status}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => handleEdit(business)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {businesses.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" align="center">
              You haven't added any businesses yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <BusinessForm 
          business={selectedBusiness}
          onClose={() => {
            setOpenForm(false);
            fetchMyBusinesses();
          }}
          userId={user?.uid}
        />
      </Dialog>
    </Box>
  );
};

export default MyBusinesses; 