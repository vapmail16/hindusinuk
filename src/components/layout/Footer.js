import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#4CAF50', // Green color
      color: 'white',
      py: 3,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © 2024 Hindus in UK. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 