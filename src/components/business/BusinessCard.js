import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Language,
  Phone,
  Email,
  Share as ShareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BusinessCard = ({ business, featured }) => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/business/${business.id}`;
    navigator.clipboard.writeText(url);
    setOpenSnackbar(true);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        ...(featured && {
          border: 2,
          borderColor: 'primary.main',
          boxShadow: 3
        })
      }}
      onClick={() => navigate(`/business/${business.id}`)}
    >
      {featured && (
        <Box 
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            position: 'absolute',
            top: 20,
            right: -30,
            transform: 'rotate(45deg)',
            width: 150,
            textAlign: 'center',
            zIndex: 1
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            FEATURED
          </Typography>
        </Box>
      )}
      <CardMedia
        component="img"
        height="140"
        image={business.logo || '/images/business-placeholder.png'}
        alt={business.name}
        sx={{ objectFit: 'contain', p: 2, bgcolor: 'grey.50' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2">
            {business.name}
          </Typography>
          <IconButton size="small" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {business.category}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {business.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {business.address}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        {business.contact?.website && (
          <Tooltip title="Website">
            <IconButton 
              size="small" 
              onClick={() => window.open(business.contact.website)}
            >
              <Language />
            </IconButton>
          </Tooltip>
        )}
        {business.contact?.phone && (
          <Tooltip title="Phone">
            <IconButton 
              size="small" 
              onClick={() => window.open(`tel:${business.contact.phone}`)}
            >
              <Phone />
            </IconButton>
          </Tooltip>
        )}
        {business.contact?.email && (
          <Tooltip title="Email">
            <IconButton 
              size="small" 
              onClick={() => window.open(`mailto:${business.contact.email}`)}
            >
              <Email />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard!"
      />
    </Card>
  );
};

export default BusinessCard; 