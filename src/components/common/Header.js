import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Box,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  ChildCare as ChildCareIcon
} from '@mui/icons-material';

const Header = ({ onLoginClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  console.log('Header render - isAdmin:', isAdmin);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#FF6B00' }}>
      <Toolbar>
        <Avatar
          src="/images/hindu.png"
          alt="Hindus in UK"
          sx={{
            width: 45,
            height: 45,
            mr: 2,
            cursor: 'pointer',
            bgcolor: 'transparent',
            '& img': {
              objectFit: 'contain'
            },
            '&:hover': {
              opacity: 0.9
            }
          }}
          onClick={() => navigate('/')}
        />
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Hindus in UK
        </Typography>

        <Box sx={{ ml: 4, flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            HOME
          </Button>
          <Button color="inherit" component={Link} to="/business">
            BUSINESS
          </Button>
          <Button color="inherit" component={Link} to="/events">
            EVENTS
          </Button>
          <Button color="inherit" component={Link} to="/kids">
            KIDS & CULTURE
          </Button>
        </Box>

        <Box>
          {user ? (
            <>
              {isAdmin && (
                <Button 
                  color="inherit"
                  component={Link}
                  to="/admin"
                >
                  ADMIN
                </Button>
              )}
              <Button 
                color="inherit"
                component={Link}
                to="/profile"
              >
                PROFILE
              </Button>
              <Button 
                color="inherit"
                onClick={handleLogout}
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <Button 
              color="inherit"
              onClick={onLoginClick}
            >
              LOGIN
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 