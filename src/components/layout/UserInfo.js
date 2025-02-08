import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UserInfo = () => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileName(userData.displayName || user.displayName || user.email);
        } else {
          setProfileName(user.displayName || user.email);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user) return null;

  return (
    <Box sx={{ 
      position: 'absolute', 
      bottom: -40,  // Position below footer
      right: 24, 
      zIndex: 2,
      backgroundColor: 'white',
      borderRadius: 1,
      padding: '4px 12px',
      boxShadow: 1
    }}>
      <Paper elevation={0} sx={{ p: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {profileName}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserInfo; 