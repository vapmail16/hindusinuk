import React from 'react';
import { Box } from '@mui/material';

const BackgroundChakra = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        maxWidth: '400px',
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: 'none',
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }
      }}
    >
      <img 
        src="/images/chakra-bg.png" 
        alt="Chakra Background" 
      />
    </Box>
  );
};

export default BackgroundChakra; 