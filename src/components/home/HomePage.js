import React from 'react';
import { Container, Box, Divider, Typography } from '@mui/material';
import HeroSection from './HeroSection';
import FeaturedBusinessesSection from './FeaturedBusinessesSection';
import UpcomingEventsSection from './UpcomingEventsSection';
import KidsActivitiesSection from './KidsActivitiesSection';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Section 1 - Hero */}
      <Box component="section" sx={{ mb: 6 }}>
        <HeroSection />
      </Box>
      
      <Divider sx={{ mb: 6 }} />

      {/* Section 2 - Featured Businesses */}
      <Box component="section" sx={{ mb: 6 }}>
        <FeaturedBusinessesSection />
      </Box>

      {/* Section 3 - Upcoming Events */}
      <Box component="section" sx={{ mb: 6 }}>
        <UpcomingEventsSection />
      </Box>

      {/* Section 4 - Kids Activities */}
      <Box component="section" sx={{ mb: 6 }}>
        <KidsActivitiesSection />
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Other sections will be added here */}
    </Container>
  );
};

export default HomePage; 