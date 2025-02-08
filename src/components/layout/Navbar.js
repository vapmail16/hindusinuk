import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from '../../config/firebase';

const Navbar = () => {
  const { user, loading, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#FF6B00' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 0, 
          textDecoration: 'none', 
          color: 'inherit',
          mr: 4
        }}>
          Hindus in UK
        </Typography>
        
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/business">Business</Button>
          <Button color="inherit" component={Link} to="/kids">Kids & Culture</Button>
        </Box>

        {!loading && (
          <Box>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                {isAdmin && (
                  <Button color="inherit" component={Link} to="/admin">
                    Admin
                  </Button>
                )}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 