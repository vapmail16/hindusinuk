import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Button, Switch, Snackbar, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Card, CardContent, CardActions
} from '@mui/material';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import BusinessManager from './BusinessManager';
import EventManager from './EventManager';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [selectedModule, setSelectedModule] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (selectedModule === 'users') {
      fetchUsers();
    }
  }, [selectedModule]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const snapshot = await getDocs(q);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLogin: doc.data().lastLogin?.toDate()
      }));
      setUsers(usersData);
      console.log('Fetched users:', usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ text: 'Error fetching users: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus,
        updatedAt: new Date(),
        updatedBy: user.email
      });
      setMessage({ text: 'User status updated successfully!', type: 'success' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      setMessage({ text: 'Error updating user: ' + error.message, type: 'error' });
    }
  };

  const handleModuleClick = (module) => {
    console.log('Module clicked:', module);
    if (module.id === 'users') {
      setSelectedModule('users');
      setActiveTab('users');
    } else {
      navigate(module.path);
    }
  };

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <PeopleIcon sx={{ fontSize: 40 }}/>,
      id: 'users',
      color: '#4CAF50'
    },
    {
      title: 'Question Review',
      description: 'Review and approve quiz questions',
      icon: <QuizIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/questions',
      color: '#2196F3'
    },
    {
      title: 'Article Management',
      description: 'Generate and manage Hindu God stories',
      icon: <ArticleIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/articles',
      color: '#E91E63'
    },
    {
      title: 'Video Management',
      description: 'Manage YouTube video links',
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/videos',
      color: '#FF0000'
    },
    {
      title: 'Dashboard Stats',
      description: 'View analytics and statistics',
      icon: <DashboardIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/stats',
      color: '#9C27B0'
    },
    {
      title: 'Businesses',
      description: 'Manage Hindu business directory',
      icon: <StorefrontIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/businesses',
      color: '#FF9800'
    },
    {
      title: 'Events',
      description: 'Manage and approve events',
      icon: <EventIcon sx={{ fontSize: 40 }}/>,
      path: '/admin/events',
      color: '#FF6B00'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {adminModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      mb: 2 
                    }}
                  >
                    <Box 
                      sx={{ 
                        bgcolor: module.color, 
                        p: 2, 
                        borderRadius: '50%',
                        mb: 2
                      }}
                    >
                      {module.icon}
                    </Box>
                    <Typography variant="h6" component="h2" align="center">
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {module.description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ mt: 'auto', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleModuleClick(module)}
                    sx={{ bgcolor: module.color }}
                  >
                    ACCESS
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedModule === 'users' && (
          <Box sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Management ({users.length} users)
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : !users.length ? (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                  No users found in the system
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow key={userData.id}>
                          <TableCell>{userData.displayName}</TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>{userData.phoneNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <Switch
                              checked={userData.isActive}
                              onChange={() => toggleUserStatus(userData.id, userData.isActive)}
                            />
                          </TableCell>
                          <TableCell>
                            {userData.updatedAt ? new Date(userData.updatedAt).toLocaleString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/admin/users/${userData.id}`)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={() => setMessage({ text: '', type: 'success' })}
      >
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard; 