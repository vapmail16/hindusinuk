import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const MISSION_STATEMENTS = [
  "To preserve and promote Hindu culture and values in kids",
  "To create and promote businesses run by Hindus"
];

const HeroSection = () => {
  return (
    <Grid container spacing={4} alignItems="flex-start">
      {/* Left Side - Text Content */}
      <Grid item xs={12} md={6}>
        <Box sx={{ pt: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h1" 
            component="h1"
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#FF6B00',
              mb: 5,
              pt: 2
            }}
          >
            Hindus in UK
          </Typography>

          <Box sx={{ mb: 3 }}>
            {MISSION_STATEMENTS.map((statement, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#FF6B00',
                    mr: 2,
                    mt: 1
                  }}
                />
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                    lineHeight: 1.4
                  }}
                >
                  {statement}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Right Side - Image */}
      <Grid item xs={12} md={6}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            px: { xs: 2, md: 4 }
          }}
        >
          <Box
            component="img"
            src="/images/homepagegod.png"
            alt="Hindu Deity"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              mb: 3,
              display: 'block',
              margin: '0 auto'
            }}
          />
          <Typography 
            variant="h5"
            sx={{ 
              color: '#FF6B00',
              fontWeight: 600,
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Jai Shree Ram
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeroSection; 