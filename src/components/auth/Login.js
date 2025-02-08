import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, 
  Box, Button, Typography, Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ open, onClose, returnPath }) => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const user = await signInWithGoogle();
      if (user) {
        onClose();
        if (returnPath) {
          navigate(returnPath);
        }
      }
    } catch (error) {
      // Don't show error for user-initiated cancellations
      if (error.message !== 'Sign-in cancelled') {
        setError(error.message || 'Failed to sign in with Google');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" align="center">
          Welcome to Hindus in UK
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          py: 2 
        }}>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ 
              width: '100%', 
              mb: 2,
              py: 1.5,
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#357ABD'
              }
            }}
          >
            Continue with Google
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login; 