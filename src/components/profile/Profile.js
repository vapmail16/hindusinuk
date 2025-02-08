import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Avatar, 
  Box, 
  Grid,
  Divider,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import MyBusinesses from './MyBusinesses';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    phoneNumber: '',
    address: '',
    occupation: '',
    interests: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(prev => ({
            ...prev,
            ...userDoc.data()
          }));
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date(),
        email: user.email
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setEditing(false);
    } catch (error) {
      setMessage({ text: 'Error updating profile: ' + error.message, type: 'error' });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ 
        p: 4, 
        mt: 4,
        position: 'relative',
        zIndex: 1 // Ensure content is above background
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            src={user?.photoURL} 
            alt={profile.displayName}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {profile.displayName || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {editing ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Interests"
                  name="interests"
                  value={profile.interests}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleSubmit}
                  sx={{ mr: 2 }}
                >
                  Save Changes
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Typography variant="body1">Phone: {profile.phoneNumber || 'Not provided'}</Typography>
                <Typography variant="body1">Address: {profile.address || 'Not provided'}</Typography>
                <Typography variant="body1">Occupation: {profile.occupation || 'Not provided'}</Typography>
                <Typography variant="body1">Interests: {profile.interests || 'Not provided'}</Typography>
              </Grid>
            </>
          )}

          {user?.isAdmin && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Administrative Access
              </Typography>
              <Typography variant="body1">
                You have administrative privileges
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <MyBusinesses />
        </Box>
      </Paper>

      <Snackbar 
        open={!!message.text} 
        autoHideDuration={6000} 
        onClose={() => setMessage({ text: '', type: 'success' })}
      >
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 