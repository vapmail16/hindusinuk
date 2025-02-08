import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tabs,
  Tab,
  IconButton,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

const MyBusinessDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('listings');

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">My Businesses</Typography>
        
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Listings" value="listings" />
          <Tab label="Analytics" value="analytics" />
          <Tab label="Settings" value="settings" />
        </Tabs>

        {selectedTab === 'listings' && (
          <MyBusinessListings />
        )}

        {selectedTab === 'analytics' && (
          <BusinessAnalytics />
        )}

        {selectedTab === 'settings' && (
          <BusinessSettings />
        )}
      </Box>
    </Container>
  );
};

export default MyBusinessDashboard; 